import { HttpService } from '@nestjs/axios';
import {
    Logger,
    Inject,
    forwardRef,
    HttpStatus,
    InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse, AxiosError } from 'axios';
import { Guid } from 'guid-typescript';
import { lastValueFrom, map, catchError } from 'rxjs';
import { AgreementsService } from 'src/agreements';
import { ApplicationsService } from 'src/applications/applications.service';
import { ApplicationTokenDto, DocumentStatusDto } from 'src/applications/dto';
import { Config, DocumentStatus, SegmentStatus } from 'src/common';
import { DocusignDocument, Segment } from 'src/entities';
import { SegmentsService } from 'src/segments/segments.service';
import { In, Repository } from 'typeorm';
import { UpdateLatestDocuSignDocumentStatusesCommand } from '../impl';

@CommandHandler(UpdateLatestDocuSignDocumentStatusesCommand)
export class UpdateDocuSignDocumentStatusesCommandHandler
    implements ICommandHandler<UpdateLatestDocuSignDocumentStatusesCommand>
{
    private logger: Logger = new Logger(
        UpdateDocuSignDocumentStatusesCommandHandler.name,
    );

    constructor(
        @Inject(forwardRef(() => ApplicationsService))
        protected readonly appService: ApplicationsService,
        protected readonly configService: ConfigService,
        protected readonly http: HttpService,
        protected readonly agreementService: AgreementsService,
        protected readonly segmentService: SegmentsService,
        protected readonly applicationService: ApplicationsService,
        @InjectRepository(DocusignDocument)
        protected readonly docuRepo: Repository<DocusignDocument>,
    ) {}

    /**
     * Returns an array of application tokens for applications awaiting document statuses that we can send to MuleSoft ESB
     * @returns {ApplicationTokenDto} application tokens for Applications with document created and awaiting signatures status
     */
    private async getApplicationTokens(): Promise<ApplicationTokenDto[]> {
        const apps = await this.docuRepo.find({
            where: { status: In([DocumentStatus.Sent, DocumentStatus.Signed]) },
        });
        return apps.map((app) => new ApplicationTokenDto(app.applicationToken));
    }

    /**
     * Returns the current statuses of pending documents
     * @returns an array of document statuses
     */
    private async getLatestAppTokenStatusesFromMuleSoft(
        applicationTokens: ApplicationTokenDto[],
    ): Promise<DocumentStatusDto[]> {
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

        this.logger.debug('Getting statuses from MuleSoft');

        const url = `${this.configService.get(
            Config.MULESOFT_ENDPOINT_URL,
        )}/agreements/statuses`;

        const data = await lastValueFrom(
            this.http
                .post(url, applicationTokens, {
                    headers,
                    withCredentials: true,
                })
                .pipe(
                    map((response: AxiosResponse) => {
                        return response.data as DocumentStatusDto[];
                    }),
                    catchError((error: AxiosError) => {
                        this.logger.error(`${JSON.stringify(error.message)}`);
                        switch (error.response.status) {
                            case HttpStatus.UNAUTHORIZED:
                                throw new InternalServerErrorException(
                                    'Could not sign in to the document signing service',
                                );
                            default:
                                throw new InternalServerErrorException(
                                    'Could not get latest statuses from MuleSoft due to an error on the server side',
                                );
                                break;
                        }
                    }),
                ),
        );
        return data;
    }

    /**
     * Delete signed application matching the application token provided
     * @param {string} status status as reported by MuleSoft ESB that should be a DocumentStatus
     * @param {string} applicationToken
     * @returns void
     */
    private async deleteSignedApplication(
        status: string,
        applicationToken: string,
    ): Promise<void> {
        const deletableStatuses = [
            DocumentStatus.Signed,
            DocumentStatus.Completed.toUpperCase(),
        ];
        if (deletableStatuses.includes(status.toUpperCase())) {
            this.logger.log(
                `Deleting application with applicationToken ${applicationToken} with status of ${status}`,
            );
            await this.appService.deleteByApplicationToken(applicationToken);
        }
        this.logger.log(
            `Skip deleting application with applicationToken ${applicationToken} with status of ${status}`,
        );
        return;
    }

    /**
     * Returns the segment from the application by the aahSegmentId
     * @param {Application} application
     * @returns {Segment} segment for the application
     */
    private async getSegment(aahSegmentId: string): Promise<Segment> {
        return this.segmentService.findOneByAahSegmentId(aahSegmentId);
    }

    /**
     * Updates the segment to adopted
     * @param {string} applicationToken
     * @param {string} status
     */
    async updateSegmentStatusToAdopted(
        applicationToken: string,
        status: string,
    ) {
        const updatableStatuses = [
            DocumentStatus.Signed.toUpperCase(),
            DocumentStatus.Completed.toUpperCase(),
        ];

        if (updatableStatuses.includes(status.toUpperCase())) {
            const application =
                await this.applicationService.findOneByApplicationToken(
                    applicationToken,
                );
            const segment = await this.getSegment(
                application.aahSegmentId.toString(10),
            );
            segment.segmentStatus = SegmentStatus.Adopted;
            await this.segmentService.save(segment);
        }
    }

    /**
     * Get the latest statuses, deletes signed applications
     * @param { GetLatestDocuSignDocumentStatusesCommand } query
     * @returns
     */
    async execute(
        command: UpdateLatestDocuSignDocumentStatusesCommand,
    ): Promise<void> {
        try {
            this.logger.log(command.message);
            const applicationTokens = await this.getApplicationTokens();
            if (applicationTokens.length === 0) {
                this.logger.log('No pending applicationTokens on MuleSoft');
                return;
            }

            const data = await this.getLatestAppTokenStatusesFromMuleSoft(
                applicationTokens,
            );

            await Promise.all(
                data.map(async (c) => {
                    await this.agreementService.updateSignedDocument(
                        c.applicationToken,
                        c.envelopeId,
                        c.envelopeStatus,
                    );
                    await this.appService.updateStatusByApplicationToken(
                        c.applicationToken,
                        c.envelopeStatus,
                    );
                    await this.updateSegmentStatusToAdopted(
                        c.applicationToken,
                        c.envelopeStatus,
                    );
                    await this.deleteSignedApplication(
                        c.envelopeStatus,
                        c.applicationToken,
                    );
                }),
            );
        } catch (err) {
            this.logger.error(err);
            throw new Error('Could not get latest DocuSign Document statuses');
        }
    }
}
