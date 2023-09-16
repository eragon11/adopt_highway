import { QueryHandler } from '@nestjs/cqrs';
import { GetRenewalAgreementsQuery } from '../impl';
import { RenewalAgreementDto } from 'src/agreements/dto';
import { ViewRoleSegment, ViewRenewalAgreement } from 'src/entities';
import { BaseSortableQueryHandler } from 'src/utils';
import { Pagination, IPaginationMeta } from 'nestjs-typeorm-paginate';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { NotFoundException } from '@nestjs/common';
import { RenewalStatus, Roles } from 'src/common';

@QueryHandler(GetRenewalAgreementsQuery)
export class GetRenewalAgreementsHandler extends BaseSortableQueryHandler<
    GetRenewalAgreementsQuery,
    RenewalAgreementDto,
    ViewRenewalAgreement
> {
    /**
     *
     */
    constructor(
        @InjectRepository(ViewRenewalAgreement)
        readonly repo: Repository<ViewRenewalAgreement>,
        @InjectMapper() readonly mapper: Mapper,
    ) {
        super(repo, mapper);
    }

    mapDto(
        pagination: Pagination<ViewRenewalAgreement, IPaginationMeta>,
    ): RenewalAgreementDto[] {
        return this.mapper.mapArray(
            pagination.items,
            RenewalAgreementDto,
            ViewRenewalAgreement,
        );
    }

    getSelectQueryBuilder(
        query: GetRenewalAgreementsQuery,
    ): SelectQueryBuilder<ViewRenewalAgreement> {
        const sqb = this.repo.createQueryBuilder('s').groupBy().where('1=1');

        if (
            ![Roles.Administrator, Roles.ReadOnlyUser].includes(
                query.currentUser.currentRole.type,
            )
        ) {
            sqb.innerJoin(
                ViewRoleSegment,
                'rs',
                'rs.GlobalId = s.GlobalID',
            ).andWhere('rs.ROLE_ID = :currentRole', {
                currentRole: query.currentUser.currentRole.id,
            });
        }

        if (query.districtNumber !== undefined) {
            sqb.andWhere('DISTRICT_NUMBER = :districtNumber', {
                districtNumber: query.districtNumber,
            });
        }

        if (query.officeNumber !== undefined) {
            sqb.andWhere('OFFICE_NUMBER = :officeNumber', {
                officeNumber: query.officeNumber,
            });
        }

        if (query.countyNumber !== undefined) {
            sqb.andWhere('COUNTY_NUMBER = :countyNumber', {
                countyNumber: query.countyNumber,
            });
        }

        if (query.groupName !== undefined) {
            sqb.andWhere("GROUP_NAME LIKE '%' + :groupName + '%'", {
                groupName: query.groupName,
            });
        }

        if (query.renewalStatus !== undefined) {
            sqb.andWhere('RENEWAL_NOTICE_SENT = :renewalStatus', {
                renewalStatus:
                    query.renewalStatus === RenewalStatus.NoticeSent ? 1 : 0,
            });
        }

        return sqb;
    }

    getSort(orderBy: string): string {
        switch (orderBy) {
            case 'districtName':
                return 'DISTRICT_NAME';
            case 'officeName':
                return 'OFFICE_NAME';
            case 'countyName':
                return 'COUNTY_NAME';
            case 'agreementEndDate':
                return 'AGREEMENT_END_DATE';
            case 'groupName':
                return 'GROUP_NAME';
            case 'aahRouteName':
                return 'AAH_ROUTE_NAME';
            case 'pickupCount':
                return 'PICKUP_COUNT';
            case 'renewalDaysRemaining':
                return 'RENEWAL_DAYS_REMAINING';
            default:
                return 'AGREEMENT_END_DATE';
        }
    }

    async execute(
        query: GetRenewalAgreementsQuery,
    ): Promise<Pagination<RenewalAgreementDto, IPaginationMeta>> {
        // get the query first
        const sqb: SelectQueryBuilder<ViewRenewalAgreement> =
            this.getSelectQueryBuilder(query);
        // we will use the query builder here to get the total items count
        const totalItems = await this.getCountQuery(sqb);
        // now we can sort the results
        const sortedQb = await this.getSortedQb(
            this.getSort(query.orderBy),
            sqb,
            query,
        );
        // paginated the return
        const pagination = await this.getPagination(sortedQb, query);
        // check for records and throw NOT FOUND as needed
        if (pagination.items.length === 0) {
            throw new NotFoundException(`No agreements were found`);
        }

        // convert our sorted Entity,  map and return the DTO array
        return this.getReturnObject(pagination, totalItems);
    }
}
