import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/applications/entities/application.entity';
import { Roles } from 'src/common';
import { County, District, Segment } from 'src/entities';
import { Repository } from 'typeorm';
import { GetApplicationByIdForUserQuery } from '../impl';

const GET_APPLICATION_BY_ID_QUERY = 'GetApplicationByIdQuery';

/**
 * Handles query to get an application using an application ID
 */
@QueryHandler(GetApplicationByIdForUserQuery)
export class GetApplicationByIdForUserQueryHandler
    implements IQueryHandler<GetApplicationByIdForUserQuery>
{
    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        @InjectRepository(Application)
        private readonly appRepo: Repository<Application>,
    ) {}

    /**
     * returns the one application with the query.applicationId
     * @param {GetApplicationByIdQuery} query
     * @returns {Application}
     */
    async execute(query: GetApplicationByIdForUserQuery): Promise<Application> {
        try {
            Logger.debug(
                'executing application query to get an application by id',
                GET_APPLICATION_BY_ID_QUERY,
            );

            // return an app for the current user
            const application = await this.appRepo
                .createQueryBuilder('t1')
                .leftJoin(
                    Segment,
                    'seg',
                    'seg.AAH_SEGMENT_ID = t1.AAH_SEGMENT_ID',
                )
                .leftJoin(
                    County,
                    't2',
                    't1.REQUESTED_HIGHWAY_COUNTY_NUMBER = t2.NUMBER',
                )
                .leftJoin(
                    'COUNTY_DISTRICT',
                    't3',
                    't2.COUNTY_ID = t3.COUNTY_ID',
                )
                .leftJoin(District, 't4', 't3.DISTRICT_ID = t4.DISTRICT_ID')
                .where(
                    `t1.APPLICATION_ID = :applicationId AND 
                    EXISTS(SELECT r1.USER_ID
                        FROM aah.ORGANIZATION o1
                        INNER JOIN aah.ROLE r1 ON o1.ORGANIZATION_ID = r1.ORGANIZATION_ID
                        WHERE r1.TYPE IN (:adminRole, :readOnlyUserRole) AND r1.USER_ID = :userId1 AND r1.ROLE_ID = :roleId1
                        UNION
                        SELECT r2.USER_ID
                        FROM aah.ORGANIZATION o2
                        INNER JOIN aah.DISTRICT d2 ON o2.ORGANIZATION_ID = d2.ORGANIZATION_ID
                        INNER JOIN aah.ROLE r2 ON o2.ORGANIZATION_ID = r2.ORGANIZATION_ID
                        WHERE r2.TYPE = :dcRole AND r2.USER_ID = :userId2 AND r2.ROLE_ID = :roleId2 
                        AND d2.DISTRICT_ID = t4.DISTRICT_ID
                        UNION
                        SELECT r3.USER_ID
                        FROM aah.ORGANIZATION o3
                        INNER JOIN aah.DISTRICT d3 ON o3.ORGANIZATION_ID = d3.ORGANIZATION_ID
                        INNER JOIN aah.MAINTENANCE_SECTION ms ON d3.NUMBER = ms.DISTRICT_NUMBER
                        INNER JOIN aah.ROLE r3 ON o3.ORGANIZATION_ID = r3.ORGANIZATION_ID
                        WHERE 
                        seg.DIST_NBR = ms.DISTRICT_NUMBER AND seg.MNT_SEC_NBR = ms.NUMBER
                        AND r3.TYPE = :mcRole AND r3.USER_ID = :userId3 AND r3.ROLE_ID = :roleId3
                        AND d3.DISTRICT_ID = t4.DISTRICT_ID)`,
                    {
                        applicationId: query.applicationId,
                        adminRole: Roles.Administrator,
                        readOnlyUserRole: Roles.ReadOnlyUser,
                        userId1: query.currentUser.id,
                        roleId1: query.currentUser.currentRole.id,
                        dcRole: Roles.DistrictCoordinator,
                        userId2: query.currentUser.id,
                        roleId2: query.currentUser.currentRole.id,
                        mcRole: Roles.MaintenanceCoordinator,
                        userId3: query.currentUser.id,
                        roleId3: query.currentUser.currentRole.id,
                    },
                )
                .getOne();

            if (!application) {
                throw new NotFoundException('Could not find the application');
            }

            return application;
        } catch (err) {
            throw err;
        }
    }
}
