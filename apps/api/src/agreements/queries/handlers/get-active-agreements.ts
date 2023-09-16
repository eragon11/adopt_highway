import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { createPaginationObject, Pagination } from 'nestjs-typeorm-paginate';
import { ActiveAgreementListDto } from 'src/agreements/dto/active.agreementlist.dto';
import {
    AgreementWhereType,
    GroupSponsorWhereType,
    SegmentWhereType,
} from 'src/agreements/typeorm';
import { AgreementStatusEnum, Roles } from 'src/common';
import { Agreement } from 'src/entities';
import { OrderByEnum } from 'src/reports/utils/report.utils';
import { In, Like, Repository } from 'typeorm';
import { GetActiveAgreementsQuery } from '../impl/get-active-agreements-query';

/**
 * Message handler for returning filtered active agreements
 */
@QueryHandler(GetActiveAgreementsQuery)
export class GetActiveAgreements
    implements IQueryHandler<GetActiveAgreementsQuery>
{
    constructor(
        @InjectRepository(Agreement)
        private repo: Repository<Agreement>,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    /**
     * Creates a where object that filters for active agreements other optional attributes
     * @param options active agreement query object for filtering and pagination
     * @returns a formatted where object
     */
    private getWhereObject(
        options: GetActiveAgreementsQuery,
    ): AgreementWhereType {
        if (options.currentUser === undefined) {
            throw new UnauthorizedException('There was no current user');
        }

        const groupSponsor: GroupSponsorWhereType = {};
        const segment: SegmentWhereType = {};

        const where: AgreementWhereType = {
            status: In([AgreementStatusEnum.Active]),
        };

        // groupSponsorWhereTypes
        if (options.groupName) {
            groupSponsor.name = Like(`%${options.groupName.trim()}%`);
            where.groupSponsor = groupSponsor;
        }

        // segmentWhereTypes

        // immediately assign district and office numbers for any roles
        if (
            options.currentUser.currentRole.type === Roles.DistrictCoordinator
        ) {
            options.districtNumber =
                options.currentUser.currentRole?.organization?.district?.number;
            segment.districtNumber =
                options.currentUser.currentRole?.organization?.district?.number;
        }
        if (
            options.currentUser.currentRole.type ===
            Roles.MaintenanceCoordinator
        ) {
            options.districtNumber =
                options.currentUser.currentRole?.organization?.maintenanceSection?.district?.number;
            segment.districtNumber =
                options.currentUser.currentRole?.organization?.maintenanceSection?.district?.number;
            segment.maintenanceOfficeNumber =
                options.currentUser.currentRole?.organization?.maintenanceSection?.number;
        }

        if (options.countyNumber) segment.countyNumber = options.countyNumber;
        if (options.districtNumber)
            segment.districtNumber = options.districtNumber;

        where.segment = segment;
        return where;
    }

    /**
     *
     * @param {GetActiveAgreementsQuery} query paginated object with filtering and sorting
     * @returns {Promise<Pagination<Agreement>>} Returns filtered active agreements sorted by most recent
     */
    async execute(
        options: GetActiveAgreementsQuery,
    ): Promise<Pagination<ActiveAgreementListDto>> {
        let skip = null;
        let take = null;

        if (options?.page && options?.limit) {
            skip = (options?.page - 1) * options?.limit;
            take = options?.limit;
        }

        const whereObj = this.getWhereObject(options);

        const [query, count] = await this.repo.findAndCount({
            skip,
            take,
            order: {
                beginDate: OrderByEnum.DESC,
            },
            relations: [
                'segment',
                'groupSponsor',
                'groupSponsor.contacts',
                'groupSponsor.contacts.user',
                'documents',
            ],
            where: whereObj,
        });

        if (count === 0) {
            throw new NotFoundException('No active agreements found');
        }

        const dto = this.mapper.mapArray(
            query,
            ActiveAgreementListDto,
            Agreement,
        );

        return createPaginationObject<ActiveAgreementListDto>({
            items: dto,
            totalItems: count,
            currentPage: options.page,
            limit: options.limit,
        });
    }
}
