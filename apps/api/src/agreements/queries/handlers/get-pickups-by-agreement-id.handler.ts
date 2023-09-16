import { QueryHandler } from '@nestjs/cqrs';
import { GetPickupsByAgreementIdQuery } from '../impl';
import { Logger, NotFoundException } from '@nestjs/common';
import { Agreement, Pickup, Segment, ViewRoleSegment } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { AgreementPickupDto } from 'src/agreements/dto/agreement.pickup.info.dto';
import { BaseSortableQueryHandler } from 'src/utils';

@QueryHandler(GetPickupsByAgreementIdQuery)
export class GetPickupsByAgreementIdHandler extends BaseSortableQueryHandler<
    GetPickupsByAgreementIdQuery,
    AgreementPickupDto,
    Pickup
> {
    logger: Logger = new Logger(GetPickupsByAgreementIdHandler.name);

    /**
     *
     */
    constructor(
        @InjectRepository(Pickup)
        readonly repo: Repository<Pickup>,
        @InjectMapper() readonly mapper: Mapper,
    ) {
        super(repo, mapper);
    }

    /**
     * Implements the sorted query we need to run
     * @param {GetPickupsByAgreementIdQuery} query the message containing the query parameters
     * @returns a paginated array of AgreementPickupDto for the requested page
     */
    getSelectQueryBuilder(
        query: GetPickupsByAgreementIdQuery,
    ): SelectQueryBuilder<Pickup> {
        return this.repo
            .createQueryBuilder('p')
            .innerJoin(Agreement, 'a', 'a.AGREEMENT_ID = p.AGREEMENT_ID')
            .leftJoinAndMapOne(
                'a.segment',
                Segment,
                's',
                'CAST(a.AAH_SEGMENT_GLOBAL_ID as VARCHAR(255)) = CAST(s.GlobalID AS VARCHAR(255))',
            )
            .innerJoin(ViewRoleSegment, 'rs', 'rs.GlobalId = s.GlobalID')
            .where(
                'a.AGREEMENT_ID = :agreementId AND rs.ROLE_ID = :currentRole',
                {
                    agreementId: query.agreementId,
                    currentRole: query.currentUser.currentRole.id,
                },
            );
    }

    /**
     * Return the agreement matching this agreement with pickups
     * @param query
     * @returns
     */
    async execute(
        query: GetPickupsByAgreementIdQuery,
    ): Promise<Pagination<AgreementPickupDto>> {
        // get the query first
        const sqb: SelectQueryBuilder<Pickup> =
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
            throw new NotFoundException(
                `No pickups were found for this agreement (id: ${query.agreementId})`,
            );
        }

        // convert our sorted Entity,  map and return the DTO array
        return this.getReturnObject(pagination, totalItems);
    }

    getSort = (orderBy: string): string => {
        switch (orderBy) {
            case 'comments':
                return 'P.COMMENT';
            case 'numberOfBagsCollected':
                return 'P.BAG_FILL_QUANTITY';
            case 'numberOfVolunteers':
                return 'P.VOLUNTEER_COUNT';
            case 'type':
                return 'P.TYPE';
            default:
                return 'P.ACTUAL_PICKUP_DATE';
        }
    };

    mapDto(
        pagination: Pagination<Pickup, IPaginationMeta>,
    ): AgreementPickupDto[] {
        return this.mapper.mapArray(
            pagination.items,
            AgreementPickupDto,
            Pickup,
        );
    }
}
