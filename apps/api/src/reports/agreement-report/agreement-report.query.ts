import { Mapper } from '@automapper/core';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
    Pagination,
    createPaginationObject,
    paginate,
} from 'nestjs-typeorm-paginate';
import { AgreementReportDto } from 'src/dto/agreementReport.dto';
import { Agreement } from 'src/entities/agreement.entity';
import { County } from 'src/entities/county.entity';
import { District } from 'src/entities/district.entity';
import { GroupSponsor } from 'src/entities/groupSponsor.entity';
import { MaintenanceSection } from 'src/entities/maintenancesection.entity';
import { Segment } from 'src/entities/segment.entity';
import { Sign } from 'src/entities/sign.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
    TypeOrmOrderedField,
    PaginationOptions,
    countQuery,
} from '../utils/report.utils';

export enum AgreementReportOrderByProperties {
    agreementId = 'agreementId',
    agreementStatus = 'agreementStatus',
    agreementBeginDate = 'agreementBeginDate',
    agreementEndDate = 'agreementEndDate',
    groupName = 'groupName',
    segmentStatus = 'segmentStatus',
    signText = 'signText',
    district = 'district',
    county = 'county',
    groupId = 'groupId',
    segmentId = 'segmentId',
    routeName = 'routeName',
    maintenanceOffice = 'maintenanceOffice',
}

function _getSortName(property: string): TypeOrmOrderedField {
    switch (property) {
        case 'agreementId':
            return {
                orderByField: 'a.AGREEMENT_ID',
            };
        case 'agreementStatus':
            return {
                orderByField: 'a.STATUS',
            };
        case 'agreementBeginDate':
            return {
                orderByField: 'a.BEGIN_DATE',
            };
        case 'groupId':
            return {
                orderByField: 'gs.GROUP_ID',
            };
        case 'segmentId':
            return {
                orderByField: 's.AAH_SEGMENT_ID',
            };
        case 'agreementEndDate':
            return {
                orderByField: 'a.END_DATE',
            };
        case 'groupName':
            return {
                orderByField: 'gs.NAME',
            };
        case 'segmentStatus':
            return {
                orderByField: 's.SEGMENT_STATUS',
            };
        case 'routeName':
            return {
                orderByField: 's.AAH_ROUTE_NAME',
            };
        case 'signText':
            return {
                orderByField: 'sn.LINE_1',
            };
        case 'district':
            return { orderByField: 's.DIST_NM' };
        case 'county':
            return { orderByField: 's.CNTY_NM' };
        case 'maintenanceOffice':
            return { orderByField: 's.MNT_OFFICE_NM' };
        default:
            return { orderByField: undefined };
    }
}

export function GetAllActiveAgreements(
    agreementRepo: Repository<Agreement>,
): SelectQueryBuilder<Agreement> {
    return agreementRepo
        .createQueryBuilder('a')
        .addSelect(
            (qb) =>
                qb
                    .from(Agreement, 'a1')
                    .select('MIN([BEGIN_DATE])', 'FIRST_CONTRACT_DATE')
                    .where('a.GROUP_ID = a1.GROUP_ID')
                    .limit(1),
            'FIRST_CONTRACT_DATE',
        )
        .leftJoinAndMapOne(
            'a.sign',
            Sign,
            'sn',
            'a.AGREEMENT_ID = sn.AGREEMENT_ID',
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

export async function PaginateAndOrderAgreementReportDto(
    agreements: SelectQueryBuilder<Agreement>,
    mapper: Mapper,
    options: PaginationOptions,
): Promise<Pagination<AgreementReportDto>> {
    const sortName = _getSortName(options?.orderByOptions?.orderBy);

    const totalItems = await countQuery<Agreement>(agreements);

    // select if provided
    if (sortName.orderByField) {
        agreements.addSelect(sortName.orderByField, 'o_ORDER_PROPERTY');
        agreements.orderBy(
            'o_ORDER_PROPERTY',
            options.orderByOptions.orderByDirection,
        );
    }

    const pagination = await paginate(agreements, options.paginationOptions);

    if (pagination.items.length == 0) {
        throw new HttpException('No records found', HttpStatus.NOT_FOUND);
    }

    const dto = mapper.mapArray(
        pagination.items,
        AgreementReportDto,
        Agreement,
    );
    return createPaginationObject<AgreementReportDto>({
        items: dto,
        totalItems: totalItems,
        currentPage: pagination.meta.currentPage,
        limit: pagination.meta.itemsPerPage,
    });
}
