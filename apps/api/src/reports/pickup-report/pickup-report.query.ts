import { Mapper } from '@automapper/core';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
    Pagination,
    paginateRawAndEntities,
    createPaginationObject,
} from 'nestjs-typeorm-paginate';
import { PickupReportDto } from 'src/dto/pickupReport.dto';
import { Agreement } from 'src/entities/agreement.entity';
import { County } from 'src/entities/county.entity';
import { District } from 'src/entities/district.entity';
import { GroupSponsor } from 'src/entities/groupSponsor.entity';
import { MaintenanceSection } from 'src/entities/maintenancesection.entity';
import { Pickup } from 'src/entities/pickup.entity';
import { PickupSchedule } from 'src/entities/pickupSchedule.entity';
import { Segment } from 'src/entities/segment.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
    TypeOrmOrderedField,
    PaginationOptions,
    countQuery,
} from '../utils/report.utils';

export enum PickupReportOrderByProperties {
    pickupId = 'pickupId',
    lastPickupDate = 'lastPickupDate',
    district = 'district',
    county = 'county',
    maintenanceOffice = 'maintenanceOffice',
    renewalDate = 'renewalDate',
    groupId = 'groupId',
    groupName = 'groupName',
    segmentId = 'segmentId',
    routeName = 'routeName',
    pickupType = 'pickupType',
    bagQuantityPerGroup = 'bagQuantityPerGroup',
    volumeQuantity = 'volumeQuantity',
    volunteerCount = 'volunteerCount',
    agreementStartDate = 'agreementStartDate',
    numberOfMiles = 'numberOfMiles',
    numberOfPickupsCompleted = 'numberOfPickupsCompleted',
}

function _getSortName(property: string): TypeOrmOrderedField {
    switch (property) {
        case 'pickupId':
            return { orderByField: 'p.PICKUP_ID' };
        case 'lastPickupDate':
            return {
                orderByField: 'p.ACTUAL_PICKUP_DATE',
            };
        case 'district':
            return { orderByField: 's.DIST_NM' };
        case 'county':
            return { orderByField: 's.CNTY_NM' };
        case 'maintenanceOffice':
            return { orderByField: 's.MNT_OFFICE_NM' };
        case 'groupName':
            return { orderByField: 'gs.NAME' };
        case 'groupId':
            return { orderByField: 'gs.GROUP_ID' };
        case 'segmentId':
            return { orderByField: 's.AAH_SEGMENT_ID' };
        case 'routeName':
            return { orderByField: 's.AAH_ROUTE_NAME' };
        case 'pickupType':
            return { orderByField: 'p.TYPE' };
        case 'renewalDate':
            return { orderByField: 'a.END_DATE' };
        case 'bagQuantityPerGroup':
            return {
                orderByField: 'p.BAG_FILL_QUANTITY',
            };
        case 'volumeQuantity':
            return {
                orderByField: 'p.VOLUME_QUANTITY',
            };
        case 'volunteerCount':
            return {
                orderByField: 'p.VOLUNTEER_COUNT',
            };
        case 'agreementStartDate':
            return { orderByField: 'a.BEGIN_DATE' };
        case 'numberOfMiles':
            return {
                orderByField: 's.SEGMENT_LENGTH_MILES',
            };
        case 'numberOfPickupsCompleted':
            return {
                orderByField: 'TOTAL_PICKUP_COUNT',
                isCalculated: true,
            };
        default:
            return { orderByField: undefined };
    }
}

/**
 *
 * @param pickupRepo
 * @returns a SelectQueryBuilder from typeorm that can be paginated, filtered and ordered
 */
export function GetAllActivePickups(
    pickupRepo: Repository<Pickup>,
): SelectQueryBuilder<Pickup> {
    return pickupRepo
        .createQueryBuilder('p')
        .addSelect(
            (qb) =>
                qb
                    .from(PickupSchedule, 'ps')
                    .innerJoinAndMapOne(
                        'ps.agreement',
                        Agreement,
                        'a1',
                        'ps.AGREEMENT_ID  = a1.AGREEMENT_ID',
                    )
                    .innerJoinAndMapMany(
                        'a.pickups',
                        Pickup,
                        'p1',
                        'a1.AGREEMENT_ID  = p1.AGREEMENT_ID',
                    )
                    .select(
                        "MAX(CONVERT(datetime, ('1/' + ps.SCHEDULED_PICKUP_YEAR_MONTH), 103))",
                        'NEXT_PICKUP_DATE',
                    )
                    .where('a1.AGREEMENT_ID = p.AGREEMENT_ID')
                    .having(
                        "MAX(CONVERT(datetime, ('1/' + ps.SCHEDULED_PICKUP_YEAR_MONTH), 103)) > GETDATE()",
                    )
                    .limit(1),
            'NEXT_PICKUP_DATE',
        )
        .addSelect(
            (qb) =>
                qb
                    .from(PickupSchedule, 'ps1')
                    .innerJoinAndMapOne(
                        'ps1.agreement',
                        Agreement,
                        'a1',
                        'ps1.AGREEMENT_ID  = a1.AGREEMENT_ID',
                    )
                    .select('COUNT(*)', 'SCHEDULED_PICKUP_COUNT')
                    .where(
                        "DATEADD(DD, -1, DATEADD(MM, 1, CONVERT(datetime, ('1/' + ps1.SCHEDULED_PICKUP_YEAR_MONTH), 103))) > a1.BEGIN_DATE AND a1.AGREEMENT_ID = p.AGREEMENT_ID",
                    )
                    .limit(1),
            'SCHEDULED_PICKUP_COUNT',
        )
        .addSelect(
            (qb) =>
                qb
                    .from(Agreement, 'a2')
                    .innerJoinAndMapOne(
                        'a2.pickups',
                        Pickup,
                        'p2',
                        'p2.AGREEMENT_ID  = a2.AGREEMENT_ID',
                    )
                    .select('COUNT(*)', 'TOTAL_PICKUP_COUNT')
                    .where(
                        'p2.ACTUAL_PICKUP_DATE > a2.BEGIN_DATE AND a2.AGREEMENT_ID = p.AGREEMENT_ID',
                    ),
            'TOTAL_PICKUP_COUNT',
        )
        .leftJoinAndMapOne(
            'p.agreement',
            Agreement,
            'a',
            'p.AGREEMENT_ID = a.AGREEMENT_ID',
        )
        .leftJoinAndMapOne(
            'a.groupSponsor',
            GroupSponsor,
            'gs',
            'a.GROUP_ID = gs.GROUP_ID',
        )
        .leftJoinAndMapOne(
            'a.segment',
            Segment,
            's',
            'CAST(a.AAH_SEGMENT_GLOBAL_ID as VARCHAR(255)) = CAST(s.GlobalID AS VARCHAR(255))',
        )
        .leftJoinAndMapOne('s.district', District, 'd', 's.DIST_ABRVN = d.CODE')
        .leftJoinAndMapOne(
            's.county',
            County,
            'c',
            'UPPER(s.CNTY_NM) = UPPER(c.NAME)',
        )
        .leftJoinAndMapOne(
            's.maintenanceSection',
            MaintenanceSection,
            'ms',
            's.MNT_SEC_NBR = ms.NUMBER AND d.NUMBER = ms.DISTRICT_NUMBER',
        )
        .where('a.STATUS = :status', {
            status: 'ACTIVE',
        });
}

/**
 *
 * @param query
 * @param options
 * @returns paginated SelectQueryBuilder of Pickup into a PickupDto
 */
export async function GetPaginatedAndOrderedPickupReportDto(
    query: SelectQueryBuilder<Pickup>,
    mapper: Mapper,
    options: PaginationOptions,
): Promise<Pagination<PickupReportDto>> {
    const sortName = _getSortName(options?.orderByOptions?.orderBy);

    const totalItems = await countQuery<Pickup>(query);

    // select if provided
    if (sortName.orderByField) {
        if (!sortName.isCalculated) {
            query
                .addSelect(sortName.orderByField, 'o_ORDER_BY_PROPERTY')
                .orderBy(
                    'o_ORDER_BY_PROPERTY',
                    options.orderByOptions.orderByDirection,
                );
        } else {
            query.orderBy(
                sortName.orderByField,
                options.orderByOptions.orderByDirection,
            );
        }
    }

    // FROM: https://github.com/nestjsx/nestjs-typeorm-paginate#raw-and-entities
    const [pagination, rawResults] = await paginateRawAndEntities(
        query,
        options.paginationOptions,
    );

    pagination.items.forEach((item) => {
        const rawResult: any = rawResults.find(
            (raw: any) => raw.p_PICKUP_ID === item.id,
        );
        item.nextPickupDate = rawResult?.NEXT_PICKUP_DATE;
        item.totalPickupCount = rawResult?.TOTAL_PICKUP_COUNT;
        item.scheduledPickupCount = rawResult?.SCHEDULED_PICKUP_COUNT;
    });

    if (pagination.items.length == 0) {
        throw new HttpException('No records found', HttpStatus.NOT_FOUND);
    }

    const dto = mapper.mapArray(pagination.items, PickupReportDto, Pickup);
    return createPaginationObject<PickupReportDto>({
        items: dto,
        totalItems: totalItems,
        currentPage: pagination.meta.currentPage,
        limit: pagination.meta.itemsPerPage,
    });
}
