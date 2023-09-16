import { Mapper } from '@automapper/core';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
    Pagination,
    createPaginationObject,
    paginate,
} from 'nestjs-typeorm-paginate';
import { SegmentReportDto } from 'src/dto/segmentReport.dto';
import { Agreement } from 'src/entities/agreement.entity';
import { County } from 'src/entities/county.entity';
import { District } from 'src/entities/district.entity';
import { MaintenanceSection } from 'src/entities/maintenancesection.entity';
import { Segment } from 'src/entities/segment.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
    TypeOrmOrderedField,
    PaginationOptions,
    countQuery,
} from '../utils/report.utils';

export enum SegmentReportOrderByProperties {
    createdOn = 'createdOn',
    routeName = 'routeName',
    segmentId = 'segmentId',
    segmentStatus = 'segmentStatus',
    agreementStatus = 'agreementStatus',
    agreementStartDate = 'agreementStartDate',
    agreementEndDate = 'agreementEndDate',
    districtName = 'districtName',
    countyName = 'countyName',
    officeName = 'maintenanceOfficeName',
    segmentFromLat = 'segmentFromLat',
    segmentFromLong = 'segmentFromLong',
    segmentToLat = 'segmentToLat',
    segmentToLong = 'segmentToLong',
}

function _getSortName(property: string): TypeOrmOrderedField {
    switch (property) {
        case 'createdOn':
            return { orderByField: 's.CREATED_ON' };
        case 'routeName':
            return { orderByField: 's.AAH_ROUTE_NAME' };
        case 'segmentId':
            return { orderByField: 's.AAH_SEGMENT_ID' };
        case 'segmentStatus':
            return { orderByField: 's.SEGMENT_STATUS' };
        case 'agreementStatus':
            return { orderByField: 'a.STATUS' };
        case 'agreementStartDate':
            return { orderByField: 'a.BEGIN_DATE' };
        case 'agreementEndDate':
            return { orderByField: 'a.END_DATE' };
        case 'districtName':
            return { orderByField: 's.DIST_NM' };
        case 'countyName':
            return { orderByField: 's.CNTY_NM' };
        case 'maintenanceOfficeName':
            return { orderByField: 's.MNT_OFFICE_NM' };
        case 'segmentFromLat':
            return { orderByField: 's.SEGMENT_FROM_LAT' };
        case 'segmentFromLong':
            return { orderByField: 's.SEGMENT_FROM_LONG' };
        case 'segmentToLat':
            return { orderByField: 's.SEGMENT_TO_LAT' };
        case 'segmentToLong':
            return { orderByField: 's.SEGMENT_TO_LONG' };
        default:
            return { orderByField: undefined };
    }
}

/**
 *
 * @param segmentRepo
 * @returns a SelectQueryBuilder from typeorm that can be paginated, filtered and ordered
 */
export function GetAllSegments(
    segmentRepo: Repository<Segment>,
): SelectQueryBuilder<Segment> {
    return segmentRepo
        .createQueryBuilder('s')
        .leftJoinAndMapOne(
            's.agreement',
            Agreement,
            'a',
            "CAST(a.SEGMENT_ID as VARCHAR(255)) = CAST(s.GlobalID AS VARCHAR(255)) AND a.STATUS = 'ACTIVE'",
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
        );
}

/**
 *
 * @param segments
 * @param options
 * @returns paginated SelectQueryBuilder of Segment into a SegmentDto
 */
export async function GetPaginatedAndOrderedSegmentReportDto(
    segments: SelectQueryBuilder<Segment>,
    mapper: Mapper,
    options: PaginationOptions,
): Promise<Pagination<SegmentReportDto>> {
    const sortName = _getSortName(options?.orderByOptions?.orderBy);

    const totalItems = await countQuery<Segment>(segments);

    // select if provided
    if (sortName.orderByField) {
        segments
            .addSelect(sortName.orderByField, 'o_ORDER_BY_PROPERTY')
            .orderBy(
                'o_ORDER_BY_PROPERTY',
                options.orderByOptions.orderByDirection,
            );
    }

    const pagination = await paginate(segments, options.paginationOptions);

    if (pagination.items.length == 0) {
        throw new HttpException('No records found', HttpStatus.NOT_FOUND);
    }

    const dto = mapper.mapArray(pagination.items, SegmentReportDto, Segment);
    return createPaginationObject<SegmentReportDto>({
        items: dto,
        totalItems: totalItems,
        currentPage: pagination.meta.currentPage,
        limit: pagination.meta.itemsPerPage,
    });
}
