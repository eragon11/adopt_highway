import { Mapper } from '@automapper/core';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
    Pagination,
    createPaginationObject,
    paginateRawAndEntities,
} from 'nestjs-typeorm-paginate';
import { AgreementsByRenewalDateReportDto } from 'src/dto/agreementsByRenewalDateReport.dto';
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
    countQuery,
    PaginationOptions,
    TypeOrmOrderedField,
} from '../utils/report.utils';

export enum AgreementsByRenewalDateReportOrderByProperties {
    agreementId = 'agreementId',
    agreementInfo = 'agreementInfo',
    agreementStatus = 'agreementStatus',
    agreementStartDate = 'agreementStartDate',
    agreementEndDate = 'agreementEndDate',
    groupId = 'groupId',
    groupName = 'groupName',
    segmentStatus = 'segmentStatus',
    signText = 'signText',
    district = 'district',
    county = 'county',
    maintenanceOffice = 'maintenanceOffice',
    totalNumberOfPickupsPerAgreementTimeline = 'totalNumberOfPickupsPerAgreementTimeline',
}

function _getSortName(property: string): TypeOrmOrderedField {
    switch (property) {
        case 'district':
            return {
                orderByField: 'd.NAME',
            };
        case 'county':
            return {
                orderByField: 'c.NAME',
            };
        case 'maintenanceOffice':
            return {
                orderByField: 'ms.NAME',
            };
        case 'agreementId':
            return {
                orderByField: 'a.AGREEMENT_ID',
            };
        case 'groupId':
            return {
                orderByField: 'gs.GROUP_ID',
            };
        case 'groupName':
            return {
                orderByField: 'gs.NAME',
            };
        case 'agreementInfo':
            return {
                orderByField: 'a.COMMENT',
            };
        case 'agreementStartDate':
            return {
                orderByField: 'a.BEGIN_DATE',
            };
        case 'agreementEndDate':
            return {
                orderByField: 'a.END_DATE',
            };
        case 'totalNumberOfPickupsPerAgreementTimeline':
            return {
                orderByField: 'TOTAL_SCHEDULED_PICKUPS_IN_TIMELINE',
                isCalculated: true,
            };
        default:
            return { orderByField: undefined };
    }
}

export function GetAllActiveAgreementsByNewRenewalDate(
    repo: Repository<Agreement>,
): SelectQueryBuilder<Agreement> {
    return repo
        .createQueryBuilder('a')
        .addSelect('DATEDIFF(dd, GETDATE(), a.END_DATE)', 'DAYS_UNTIL_RENEWAL')
        .addSelect(
            (qb) =>
                qb
                    .from(PickupSchedule, 'psc1')
                    .addSelect('COUNT(*)')
                    .where(
                        "psc1.AGREEMENT_ID = a.AGREEMENT_ID AND (CONVERT(datetime, ('1/' + psc1.SCHEDULED_PICKUP_YEAR_MONTH), 103)) BETWEEN a.BEGIN_DATE AND a.END_DATE",
                    ),
            'TOTAL_SCHEDULED_PICKUPS_IN_TIMELINE',
        )
        .addSelect(
            (qb) =>
                qb
                    .from(Pickup, 'pu1')
                    .select('COUNT(*)')
                    .where(
                        'pu1.AGREEMENT_ID = a.AGREEMENT_ID AND pu1.ACTUAL_PICKUP_DATE BETWEEN a.BEGIN_DATE AND a.END_DATE',
                    ),
            'TOTAL_PICKUPS_IN_TIMELINE',
        )
        .addSelect(
            "CASE \
            WHEN DATEDIFF(dd, GETDATE(), a.END_DATE) <=30 \
                THEN '1-next30days' \
            WHEN (DATEDIFF(dd, GETDATE(), a.END_DATE) > 30 AND DATEDIFF(dd, GETDATE(), a.END_DATE) <=60) \
                THEN '2-between30And60days' \
            ELSE '3-moreThan60days' \
            END",
            'RENEWAL_TIMEFRAME',
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
        })
        .andWhere('a.END_DATE >= GETDATE()');
}

export async function PaginateAndOrderAgreementsByRenewalDateReportDto(
    agreements: SelectQueryBuilder<Agreement>,
    mapper: Mapper,
    options: PaginationOptions,
): Promise<Pagination<AgreementsByRenewalDateReportDto>> {
    const sortName = _getSortName(options?.orderByOptions?.orderBy);

    const totalItems = await countQuery<Agreement>(agreements);

    // ALWAYS SORT FIRST BY TIMEFRAME ASCENDING
    agreements.orderBy('RENEWAL_TIMEFRAME', 'ASC');

    // select if provided
    if (!sortName.isCalculated && sortName.orderByField) {
        agreements.addSelect(sortName.orderByField, 'o_ORDER_PROPERTY');
        agreements.addOrderBy(
            'o_ORDER_PROPERTY',
            options.orderByOptions.orderByDirection,
        );
    }

    if (sortName.isCalculated && sortName.orderByField) {
        agreements.addOrderBy(
            sortName.orderByField,
            options.orderByOptions.orderByDirection,
        );
    }
    // FROM: https://github.com/nestjsx/nestjs-typeorm-paginate#raw-and-entities
    const [pagination, rawResults] = await paginateRawAndEntities(
        agreements,
        options.paginationOptions,
    );

    pagination.items.forEach((item) => {
        const rawResult: any = rawResults.find(
            (raw: any) => raw.a_AGREEMENT_ID === item.agreementId,
        );
        item.renewalTimeframe = rawResult?.RENEWAL_TIMEFRAME;
        item.totalNumberOfPickupsPerAgreementTimeline =
            rawResult?.TOTAL_PICKUPS_IN_TIMELINE;
        item.totalNumberOfScheduledPickupsPerAgreementTimeline =
            rawResult?.TOTAL_SCHEDULED_PICKUPS_IN_TIMELINE;
    });

    if (pagination.items.length == 0) {
        throw new HttpException('No records found', HttpStatus.NOT_FOUND);
    }

    const dto: AgreementsByRenewalDateReportDto[] = mapper.mapArray(
        pagination.items,
        AgreementsByRenewalDateReportDto,
        Agreement,
    );

    return createPaginationObject<AgreementsByRenewalDateReportDto>({
        items: dto,
        totalItems: totalItems,
        currentPage: pagination.meta.currentPage,
        limit: pagination.meta.itemsPerPage,
    });
}
