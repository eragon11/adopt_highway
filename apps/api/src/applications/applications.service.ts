import { MaintenanceSection } from 'src/entities/maintenancesection.entity';
import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    NotImplementedException,
} from '@nestjs/common';
import {
    Repository,
    SelectQueryBuilder,
    Brackets,
    FindConditions,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { GetApplicationsQuery } from './queries/impl/get-applications.query';
import { ApplicationStatus, Roles } from '../common/enum';
import { District, Role, County, Segment, DocusignDocument } from '../entities';

@Injectable()
export class ApplicationsService {
    constructor(
        @InjectRepository(Application)
        private readonly appRepo: Repository<Application>,
    ) {}

    private readonly logger = new Logger(ApplicationsService.name);

    /**
     * Returns all applications with a given status
     * @param {ApplicationStatus} status
     * @returns array of applications matching the status
     */
    async findByStatus(status: ApplicationStatus): Promise<Application[]> {
        return await this.appRepo.find({ status });
    }

    /**
     * Adds location based on role to params
     * @param {GetApplicationsQuery} params
     * @param {Role} role of the current user
     * @returns {GetApplicationsQuery} updated params
     */
    updateParamsWithUsersArea(
        params: GetApplicationsQuery,
        role: Role,
    ): GetApplicationsQuery {
        switch (role?.type) {
            case Roles.Administrator:
            case Roles.ReadOnlyUser:
                break;
            case Roles.DistrictCoordinator:
                params.districtNumber = role?.organization?.district?.number;
                break;
            case Roles.MaintenanceCoordinator:
                params.districtNumber =
                    role?.organization?.maintenanceSection?.district?.number;
                params.officeNumber =
                    role?.organization?.maintenanceSection?.number;
                break;
            default:
                throw new NotImplementedException(
                    `${role.type} has not been implemented`,
                );
                break;
        }
        return params;
    }

    /**
     * Returns a SelectQueryBuilder object of type Applications filtered for applications that can be used in queries
     * @param {GetApplicationsQuery} params
     * @returns {SelectQueryBuilder} of all applications
     */

    findAllAppsWithParams(
        params: GetApplicationsQuery,
    ): SelectQueryBuilder<Application> {
        try {
            const query = this.findAllApplications(params);

            const role = params.currentUser?.currentRole;

            // add district param filter for Administrators
            if (params.districtNumber && role.type == Roles.Administrator) {
                query
                    .leftJoin(
                        County,
                        't2',
                        'app.REQUESTED_HIGHWAY_COUNTY_NUMBER = t2.NUMBER',
                    )
                    .leftJoin(
                        'COUNTY_DISTRICT',
                        't3',
                        't2.COUNTY_ID = t3.COUNTY_ID',
                    )
                    .leftJoin(District, 't4', 't3.DISTRICT_ID = t4.DISTRICT_ID')
                    .where('t4.NUMBER = :districtNumber', {
                        districtNumber: params.districtNumber,
                    });
            }

            // the following criteria are bracketed AND clauses
            query.andWhere(
                new Brackets((sqb) => {
                    // add application ID
                    if (params.id) {
                        sqb.andWhere('app.APPLICATION_ID = :id', {
                            id: params.id,
                        });
                    }

                    // add created on
                    if (params.createdOn) {
                        sqb.andWhere('app.CREATED_ON = :createdOn', {
                            createdOn: params.createdOn,
                        });
                    }

                    // search by groupName
                    if (params.groupName) {
                        sqb.andWhere(
                            "app.GROUP_NAME LIKE '%' + :groupName + '%'",
                            {
                                groupName: params.groupName,
                            },
                        );
                    }

                    // add primary contact email
                    if (params.primaryContactEmail) {
                        sqb.andWhere(
                            'app.PRIMARY_CONTACT_EMAIL = :primaryContactEmail',
                            {
                                primaryContactEmail: params.primaryContactEmail,
                            },
                        );
                    }

                    // add requested segment county number
                    if (params.requestedHighwayCountyNumber) {
                        sqb.andWhere(
                            'app.REQUESTED_HIGHWAY_COUNTY_NUMBER = :requestedHighwayCountyNumber',
                            {
                                requestedHighwayCountyNumber:
                                    params.requestedHighwayCountyNumber,
                            },
                        );
                    }

                    // add volunteer segment name
                    if (params.aahRouteName) {
                        sqb.andWhere('app.AAH_ROUTE_NAME = :aahRouteName', {
                            aahRouteName: params.aahRouteName,
                        });
                    }

                    // add application status
                    if (params.applicationStatus) {
                        sqb.andWhere('app.STATUS = :applicationStatus', {
                            applicationStatus: params.applicationStatus,
                        });
                    }
                }),
            );

            return query;
        } catch (err) {
            this.logger.error(err.message);
            throw err;
        }
    }

    findAllApplications(
        params: GetApplicationsQuery,
    ): SelectQueryBuilder<Application> {
        if (!params.currentUser) {
            //TBD
        }

        // Add sort queries: first sort if the application hasn't been modified > 2wks
        // then on most recently submitted applications
        const query = this.appRepo
            .createQueryBuilder('app')
            .addSelect('t4.DISTRICT_ID', 'DISTRICT_ID')
            .addSelect('t4.NAME', 'DISTRICT_NAME')
            .addSelect('t4.NUMBER', 'DISTRICT_NUMBER')
            .addSelect(
                'CASE \
                WHEN app.MODIFIED_ON < DATEADD(day,-14,GETDATE()) \
                   THEN app.MODIFIED_ON\
                ELSE null \
                END',
                'NOT_MODIFIED_2WKS',
            )
            .addSelect(
                'CASE \
                WHEN app.CREATED_ON < DATEADD(day,-30,GETDATE()) \
                    THEN app.EXPIRES_ON \
                ELSE null \
                END',
                'OLDER_30DAYS',
            )
            .addSelect(
                'CASE \
                WHEN app.MODIFIED_ON > DATEADD(day,-14,GETDATE()) OR app.MODIFIED_ON IS NULL \
                   THEN app.CREATED_ON \
                END',
                'SORT_CREATED_BY',
            )
            .leftJoinAndSelect('app.county', 'requestedHighwayCountyName')
            .leftJoin(
                County,
                't2',
                'app.REQUESTED_HIGHWAY_COUNTY_NUMBER = t2.NUMBER',
            )
            .leftJoin('COUNTY_DISTRICT', 't3', 't2.COUNTY_ID = t3.COUNTY_ID')
            .leftJoin(District, 't4', 't3.DISTRICT_ID = t4.DISTRICT_ID');

        //For District Coordinators, only return applications within their District
        const role = params.currentUser?.currentRole;
        params = this.updateParamsWithUsersArea(params, role);

        if (params.districtNumber && role.type == Roles.DistrictCoordinator) {
            query.where('t4.NUMBER = :districtNumber', {
                districtNumber: params.districtNumber,
            });
        }

        if (
            params.districtNumber &&
            params.officeNumber &&
            role.type == Roles.MaintenanceCoordinator
        ) {
            query
                .leftJoin(
                    MaintenanceSection,
                    't5',
                    't4.NUMBER = t5.DISTRICT_NUMBER',
                )
                .innerJoin(
                    Segment,
                    'seg',
                    'app.AAH_SEGMENT_ID = seg.AAH_SEGMENT_ID',
                )
                .where(
                    `seg.DIST_NBR = :districtNumber AND seg.MNT_SEC_NBR = :officeNumber`,
                    {
                        districtNumber: params.districtNumber,
                        officeNumber: params.officeNumber,
                    },
                );
        }

        return query;
    }

    findUnconfirmedAppsOver24rsOld(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        params: GetApplicationsQuery,
    ): SelectQueryBuilder<Application> {
        // Add sort queries: first sort if the application hasn't been modified > 2wks
        // then on most recently submitted applications
        const query = this.appRepo
            .createQueryBuilder('app')
            .addSelect(
                'CASE \
                WHEN app.CREATED_BY > DATEADD(day,-30,GETDATE()) \
                   THEN app.CREATED_BY \
                END',
                'OVER_30days_OLD',
            );

        return query;
    }

    async findOne(applicationId: number): Promise<Application> {
        return this.appRepo
            .createQueryBuilder('app')
            .where('APPLICATION_ID = :applicationId', {
                applicationId: applicationId,
            })
            .getOne();
    }

    async findOneByApplicationToken(
        applicationToken: string,
    ): Promise<Application> {
        const app = await this.appRepo.findOne({
            applicationToken: applicationToken,
        });

        if (!app) {
            throw new NotFoundException(
                `Could not find an application with an applicationToken of ${applicationToken}`,
            );
        }

        return app;
    }
    async confirmByTokens(
        applicationToken: string,
        accessToken: string,
    ): Promise<void> {
        await this.appRepo
            .createQueryBuilder('a')
            .update(Application)
            .set({
                status: () =>
                    `'${ApplicationStatus.SegmentAssignmentNeeded.toString()}'`,
                modifiedOn: () => `GETDATE()`,
            })
            .where(
                `APPLICATION_TOKEN = :applicationToken AND 
            STATUS = :status AND 
            EXPIRES_ON > GETDATE()`,
                {
                    applicationToken: applicationToken,
                    accessToken: accessToken,
                    status: ApplicationStatus.NotConfirmed,
                },
            )
            .execute();
    }

    async confirmById(applicationId: number): Promise<void> {
        await this.appRepo
            .createQueryBuilder('a')
            .update(Application)
            .set({
                status: () =>
                    `'${ApplicationStatus.SegmentAssignmentNeeded.toString()}'`,
                modifiedOn: () => `GETDATE()`,
            })
            .where(
                `APPLICATION_ID = :applicationId AND 
            STATUS = :status AND 
            EXPIRES_ON > GETDATE()`,
                {
                    applicationId: applicationId,
                    status: ApplicationStatus.NotConfirmed,
                },
            )
            .execute();
    }

    /**
     * Gets applications with pending documents (DOCUMENT.STATUS = 'sent')
     * @returns Applications with pending documents
     */
    async getApplicationWithPendingDocuments(): Promise<Application[]> {
        return await this.appRepo
            .createQueryBuilder('app')
            .innerJoinAndSelect(
                (qb) =>
                    qb
                        .from(DocusignDocument, 'dd')
                        .select('APPLICATION_TOKEN')
                        .addSelect('STATUS', 'DOCUSIGN_MULESOFT_STATUS')
                        .where(`dd.STATUS = 'sent'`),
                't1',
                'app.APPLICATION_TOKEN = t1.APPLICATION_TOKEN',
            )
            .getMany();
    }

    /**
     * Deletes the Application with the applicationId provided
     * @param applicationId number of the application to delete
     */
    async deleteById(applicationId: number): Promise<void> {
        const findConditions: FindConditions<Application> = {
            id: applicationId,
        };
        await this.appRepo.delete(findConditions);
    }

    /**
     * Deletes the Application with the applicationToken provided
     * @param applicationToken string of the application to delete
     */
    async deleteByApplicationToken(applicationToken: string): Promise<void> {
        const findConditions: FindConditions<Application> = {
            applicationToken,
        };
        await this.appRepo.delete(findConditions);
    }

    async updateStatusByApplicationToken(
        applicationToken: string,
        status: string,
    ) {
        try {
            const app = await this.findOneByApplicationToken(applicationToken);

            const appStatus =
                status === 'completed'
                    ? ApplicationStatus.Completed
                    : app.status;

            await this.appRepo
                .createQueryBuilder('a')
                .update(Application)
                .set({
                    status: () => `'${appStatus}'`,
                    mulesoftStatus: () => `'${status}'`,
                    modifiedOn: () => `GETDATE()`,
                })
                .where(`APPLICATION_ID = :applicationId`, {
                    applicationId: app.id,
                })
                .execute();
        } catch (err) {
            this.logger.error(err.message);
            throw new InternalServerErrorException(
                `Could not update status for application with applicationToken: ${applicationToken}`,
            );
        }
    }
}
