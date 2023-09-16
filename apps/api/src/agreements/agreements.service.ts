import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    IPaginationOptions,
    Pagination,
    paginate,
} from 'nestjs-typeorm-paginate';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
    Agreement,
    DocusignDocument,
    GroupSponsor,
    Segment,
    Sign,
    PickupSchedule,
    Pickup,
    County,
    District,
    MaintenanceSection,
    Email,
    ViewRoleSegment,
} from 'src/entities';
import { Config, DocumentStatus } from 'src/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AgreementsService {
    private readonly logger: Logger = new Logger(AgreementsService.name);

    constructor(
        @InjectRepository(Agreement)
        private agreementRepo: Repository<Agreement>,
        @InjectRepository(DocusignDocument)
        private docuRepo: Repository<DocusignDocument>,
        private readonly configService: ConfigService,
        @InjectMapper() readonly mapper: Mapper,
    ) {}

    private getAllAgreements: SelectQueryBuilder<Agreement> = this.agreementRepo
        .createQueryBuilder('a')
        .leftJoinAndMapOne('a.sign', Sign, 'sn', 'a.agreementId = sn.id')
        .leftJoinAndMapMany(
            'a.groupSponsor',
            GroupSponsor,
            'gs',
            `a.groupSponsor.id = gs.id`,
        )
        .leftJoinAndSelect('gs.contacts', 'gc')
        .leftJoinAndSelect('gc.user', 'u')
        .leftJoinAndMapMany('u.emails', Email, 'e', 'u.USER_ID = e.USER_ID')
        .leftJoinAndMapOne(
            'a.segment',
            Segment,
            's',
            'CAST(a.AAH_SEGMENT_GLOBAL_ID as VARCHAR(255)) = CAST(s.GlobalID AS VARCHAR(255))',
        )
        .leftJoinAndMapOne('s.county', County, 'c', 's.CNTY_NBR = c.NUMBER')
        .leftJoinAndMapOne('s.district', District, 'd', 's.DIST_NBR = d.NUMBER')
        .leftJoinAndMapOne(
            's.maintenanceSection',
            MaintenanceSection,
            'ms',
            's.DIST_NBR = ms.DISTRICT_NUMBER AND s.MNT_SEC_NBR = ms.NUMBER',
        )
        .leftJoinAndMapMany(
            'a.picksupSchedules',
            PickupSchedule,
            'ps',
            'ps.AGREEMENT_ID = a.AGREEMENT_ID',
        )
        .innerJoinAndMapMany(
            'a.pickups',
            Pickup,
            'p',
            'p.AGREEMENT_ID = a.AGREEMENT_ID',
        )
        .innerJoin(ViewRoleSegment, 'rs', 'rs.GlobalId = s.GlobalID');

    async paginate(
        options: IPaginationOptions,
    ): Promise<Pagination<Agreement>> {
        return paginate<Agreement>(this.getAllAgreements, options);
    }

    /**
     * Returns an agreement matching the application token
     * @param {string} applicationToken of the agreement when created
     * @returns {Agreement} agreement for that application token
     */
    async getByApplicationToken(applicationToken: string): Promise<Agreement> {
        return await this.agreementRepo.findOne({
            where: { applicationToken },
        });
    }

    /**
     *
     * @param {Agreement} agreement
     * @returns
     */
    async save(agreement: Agreement): Promise<Agreement> {
        return await this.agreementRepo.save(agreement);
    }

    /*
     * Returns the first document that matches the applicationToken
     * @param {string} applicationToken
     * @returns {DocusignDocument} matching document
     */
    async findDocumentByToken(
        applicationToken: string,
    ): Promise<DocusignDocument> {
        const options = {
            where: { applicationToken },
        };

        return this.docuRepo.findOne(options);
    }

    getDocumentStatus(status: string) {
        switch (status) {
            case 'completed':
                return DocumentStatus.Completed;
            case 'created':
                return DocumentStatus.Created;
            case 'declined':
                return DocumentStatus.Declined;
            case 'delivered':
                return DocumentStatus.Delivered;
            case 'sent':
                return DocumentStatus.Sent;
            case 'signed':
                return DocumentStatus.Signed;
            case 'voided':
                return DocumentStatus.Voided;
            default:
                break;
        }
    }

    /**
     * Updates the document with the recent status
     * @param applicationToken
     * @param documentId
     * @param status
     * @returns
     */
    async updateSignedDocument(
        applicationToken: string,
        documentId: string,
        status: string,
    ): Promise<void> {
        try {
            const docStatus: DocumentStatus = this.getDocumentStatus(status);

            this.logger.log(
                `Updating status for document on applicationToken: ${applicationToken}`,
            );
            const awsBucketUri = this.configService.get(Config.AWS_BUCKET_URI);
            const templateName = `${awsBucketUri}/${documentId}`;
            const options = {
                where: { applicationToken },
            };

            const document: DocusignDocument = await this.docuRepo.findOne(
                options,
            );

            if (!document) {
                const agreement: Agreement = await this.agreementRepo.findOne(
                    options,
                );
                if (!agreement) {
                    throw new NotFoundException(
                        `Could not find agreement with applicationToken: ${applicationToken} and documentId ${documentId}`,
                    );
                }
                // no document; create one
                this.logger.log(
                    `Creating new document for applicationToken: ${applicationToken} with status of ${status}`,
                );

                const insert = new DocusignDocument();
                insert.agreement = agreement;
                insert.applicationToken = agreement.applicationToken;
                insert.sentDate = new Date();
                insert.templateName = templateName;
                insert.status = docStatus;
                await this.docuRepo.insert(insert);
                return;
            }

            // update the existing document
            this.logger.log(
                `Updating existing document for applicationToken: ${applicationToken} with status of ${status}`,
            );
            document.templateName = document.templateName ?? templateName;
            document.status = docStatus;
            await this.docuRepo.save(document);
        } catch (err) {
            this.logger.error(err);
        }
    }
}
