import { UserStatusEnum } from './../../../common/enum';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'src/common';
import { District, Email, Organization, Phone, Role, User } from 'src/entities';
import { Repository } from 'typeorm';
import { GetDistrictCoordinatorsForSegmentQuery } from '../impl/get-district-coordinator-for-segment';

@QueryHandler(GetDistrictCoordinatorsForSegmentQuery)
export class GetDistrictCoordinatorsForSegmentHandler
    implements IQueryHandler<GetDistrictCoordinatorsForSegmentQuery>
{
    constructor(
        @InjectRepository(User) private readonly repo: Repository<User>,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    async execute(
        query: GetDistrictCoordinatorsForSegmentQuery,
    ): Promise<User[]> {
        return await this.repo
            .createQueryBuilder('u')
            .leftJoinAndMapMany('u.emails', Email, 'e', 'u.USER_ID = e.USER_ID')
            .leftJoinAndMapMany('u.phones', Phone, 'p', 'u.USER_ID = p.USER_ID')
            .leftJoinAndMapOne('u.roles', Role, 'r', 'u.USER_ID = r.USER_ID')
            .leftJoinAndMapOne(
                'r.organization',
                Organization,
                'o',
                'r.ORGANIZATION_ID = o.ORGANIZATION_ID',
            )
            .leftJoinAndMapOne(
                'o.district',
                District,
                'd',
                'd.ORGANIZATION_ID = o.ORGANIZATION_ID',
            )
            .leftJoin('AAH_GIS_SEGMENTS', 's', 'd.NUMBER = s.DIST_NBR')
            .where(
                'u.STATUS = :status AND s.AAH_SEGMENT_ID = :aahSegmentId AND r.TYPE = :dcRole',
                {
                    status: UserStatusEnum.Active,
                    aahSegmentId: query.segmentId,
                    dcRole: Roles.DistrictCoordinator,
                },
            )
            .getMany();
    }
}
