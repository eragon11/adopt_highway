import { Validator } from 'class-validator';
import { Config, DocumentStatus } from 'src/common/enum';
import { CreateSigningDocumentDto } from '../../dto/create-signing-document.dto';
import { Mapper } from '@automapper/core';
import { ConfigService } from '@nestjs/config';
import {
    BadRequestException,
    HttpStatus,
    InternalServerErrorException,
    UnprocessableEntityException,
} from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    ICommandHandler,
    QueryBus,
} from '@nestjs/cqrs';
import { Application } from 'src/applications/entities';
import { ApplicationStatus } from 'src/common';
import { CreateDocuSignDocumentCommand } from '../impl/create-docusign-document.dto';
import { ApplicationHandlerBase } from './application-handler-base';
import { ApplicationsService } from 'src/applications/applications.service';
import { DistrictsService } from 'src/districts/districts.service';
import { HttpService } from '@nestjs/axios';
import { InjectMapper } from '@automapper/nestjs';
import { Guid } from 'guid-typescript';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, map, lastValueFrom } from 'rxjs';
import { MulesoftCreateDocumentResponseDto } from 'src/applications/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agreement, DocusignDocument, User } from 'src/entities';
import { CreateNewAgreementCommand } from 'src/agreements/commands/impl';
import { GetAgreementByApplicationTokenQuery } from 'src/agreements';

@CommandHandler(CreateDocuSignDocumentCommand)
export class CreateDocuSignDocumentHandler
    extends ApplicationHandlerBase
    implements ICommandHandler<CreateDocuSignDocumentCommand>
{
    private readonly validator: Validator;
    private readonly docuRepo: Repository<DocusignDocument>;
    constructor(
        @InjectRepository(DocusignDocument)
        docuRepo: Repository<DocusignDocument>,
        protected readonly configService: ConfigService,
        protected readonly districtService: DistrictsService,
        protected readonly commandBus: CommandBus,
        protected readonly queryBus: QueryBus,
        protected readonly applicationService: ApplicationsService,
        @InjectMapper() private readonly mapper: Mapper,
        private readonly http: HttpService,
    ) {
        super(
            configService,
            districtService,
            commandBus,
            queryBus,
            applicationService,
        );
        this.docuRepo = docuRepo;
        this.validator = new Validator();
    }

    /**
     * Sends the signing document to MuleSoft/DocuSign
     * @param {CreateSigningDocumentDto} dto
     */
    private async postMuleSoftDocument(
        dto: CreateSigningDocumentDto,
    ): Promise<MulesoftCreateDocumentResponseDto> {
        const clientId = this.configService.get(Config.MULESOFT_CLIENT_ID);
        const clientSecret = this.configService.get(
            Config.MULESOFT_CLIENT_SECRET,
        );

        const headers = {
            'x-correlation-id': Guid.create().toString(),
            'x-source-system': 'AAH',
            client_id: clientId,
            client_secret: clientSecret,
        };

        this.logger.debug(`Sending data to MuleSoft: ${JSON.stringify(dto)}`);

        const url = `${this.configService.get(
            Config.MULESOFT_ENDPOINT_URL,
        )}/agreements`;
        const responseData = this.http
            .post(url, dto, {
                headers,
                withCredentials: true,
            })
            .pipe(
                map((response: AxiosResponse) => {
                    return response.data;
                }),
                catchError((error: AxiosError) => {
                    this.logger.error(error as unknown);
                    switch (true) {
                        case error.response?.data &&
                            error.response?.data['errorCode'] &&
                            error.response?.data['errorCode'] ===
                                'INVALID_EMAIL_ADDRESS_FOR_RECIPIENT':
                            throw new BadRequestException(
                                'There was a missing or invalid email. Please check primary, secondary emails. Also, verify that a district coordinator exists for this county with a valid email.',
                            );
                        case error.response.status === HttpStatus.UNAUTHORIZED:
                            throw new InternalServerErrorException(
                                'Could not sign in to the document signing service',
                            );
                        case error.response.status === HttpStatus.BAD_REQUEST:
                            throw new BadRequestException(error.response.data);
                        default:
                            throw new InternalServerErrorException(
                                'Could not initiate signing process because of a server error. Please contact the AAH Administrator',
                            );
                            break;
                    }
                }),
            );

        const data = (await lastValueFrom(
            responseData,
        )) as MulesoftCreateDocumentResponseDto;

        this.logger.debug(
            `data: ${JSON.stringify(data)}`,
            CreateDocuSignDocumentHandler.name,
        );
        return data;
    }

    /**
     * Updates the application after sending it to MuleSoft/DocuSign
     * @param {Application} application
     */
    private async UpdateApplicationStatus(application: Application) {
        await this.updateApplicationStatus(
            application.id,
            ApplicationStatus.DocumentCreatedAndAwaitingSignatures,
            DocumentStatus.Sent,
        ).catch((err) => {
            this.logger.error(
                `Could not update application status ${err.message}`,
                CreateDocuSignDocumentHandler.name,
            );
            throw new InternalServerErrorException(
                'Could not update application status',
            );
        });
    }

    /**
     * Return an existing agreement by application token
     * @param {string} applicationToken
     * @param {User} user
     * @returns {Agreement} existing agreement
     */
    private async GetExistingAgreement(applicationToken: string, user: User) {
        const query = new GetAgreementByApplicationTokenQuery(
            applicationToken,
            user,
        );
        const agreement = await this.queryBus.execute(query);
        if (agreement) {
            return agreement;
        }
    }

    /**
     * Creates a new agreement for the application ID provided
     * @param {number} applicationId
     * @param {User} user
     * @returns {Agreement} newly created agreement
     */
    private async getOrCreateNewAgreement(
        applicationId: number,
        applicationToken: string,
        user: User,
    ): Promise<Agreement> {
        const agreement = await this.GetExistingAgreement(
            applicationToken,
            user,
        );
        if (agreement) {
            return agreement;
        }

        const command = new CreateNewAgreementCommand(applicationId, user);
        return await this.commandBus.execute(command).catch((err) => {
            this.logger.error(err.message);
            throw new InternalServerErrorException(
                'Could not create a new agreement from our application',
            );
        });
    }

    /**
     * Creates a DocusignDocument record for our new signing request
     * @param {number} applicationId
     * @param {MulesoftCreateDocumentResponseDto} data received from MuleSoft ESB
     * @param {User} user
     */
    private async createDocuSignDocument(
        agreement: Agreement,
        applicationId: number,
        data: MulesoftCreateDocumentResponseDto,
    ) {
        this.logger.debug(
            `Creating a DocuSign document record for applicationId: ${applicationId}`,
        );

        const doc = new DocusignDocument();
        doc.agreement = agreement;
        doc.templateName = `${data.envelopeId}`;
        doc.applicationToken = agreement.applicationToken;
        doc.sentDate = new Date();
        doc.status = DocumentStatus.Sent;

        await this.docuRepo.save(doc).catch((err) => {
            this.logger.error(err.message);
            throw new InternalServerErrorException(
                'Could not create a Docusign Document record for this signing request',
            );
        });
    }

    /**
     * Sends an application to MuleSoft for signing on DocuSign
     *
     * @param {CreateDocuSignDocumentCommand} command object with id and current user
     */
    async execute(command: CreateDocuSignDocumentCommand): Promise<any> {
        try {
            this.logger.debug(
                `Sending document with applicationId: ${command.applicationId}`,
            );

            const application: Application = await this.getApplicationById(
                command.applicationId,
                command.currentUser,
            );

            // throw HTTP 422 Unprocessable Entity if the status is not FinalReviewCreateAgreement
            if (
                application.status !==
                ApplicationStatus.FinalReviewCreateAgreement
            ) {
                throw new UnprocessableEntityException(
                    `Application (id: ${command.applicationId}) cannot be sent for signing`,
                );
            }

            // generate an object with required properties for creating a signing document
            const dto = this.mapper.map(
                application,
                CreateSigningDocumentDto,
                Application,
            );

            const errors = await this.validator.validate(dto);

            if (errors.length > 0) {
                throw new BadRequestException(
                    'There is a problem with the request',
                );
            }

            const agreement = await this.getOrCreateNewAgreement(
                application.id,
                application.applicationToken,
                command.currentUser,
            );

            const segmentLength =
                agreement?.segment?.segmentLengthMiles.toString() ?? '2';

            dto.groupId = agreement.groupSponsor?.id.toString(10);
            dto.segmentLength = segmentLength;

            // make the request
            const data = await this.postMuleSoftDocument(dto).catch((err) => {
                this.logger.error(
                    err.message,
                    CreateDocuSignDocumentHandler.name,
                );
                throw err;
            });

            const muleSoftStatus = data.envelopeStatus;

            // create the Document
            await this.createDocuSignDocument(
                agreement,
                application.id,
                data,
            ).catch((err) => {
                this.logger.error(
                    err.message,
                    CreateDocuSignDocumentHandler.name,
                );
                throw err;
            });

            // update the status
            await this.UpdateApplicationStatus(application).catch((err) => {
                this.logger.error(
                    err.message,
                    CreateDocuSignDocumentHandler.name,
                );
                throw err;
            });

            return {
                applicationId: application.id,
                muleSoftStatus: muleSoftStatus,
            };
        } catch (err) {
            this.logger.error(err.stack);
            return err;
        }
    }
}
