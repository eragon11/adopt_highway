import { Mapper } from '@automapper/core';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
    Pagination,
    createPaginationObject,
    paginateRawAndEntities,
} from 'nestjs-typeorm-paginate';
import SignReportDto from 'src/dto/signReport.dto';
import { Agreement } from 'src/entities/agreement.entity';
import { County } from 'src/entities/county.entity';
import { District } from 'src/entities/district.entity';
import { GroupSponsor } from 'src/entities/groupSponsor.entity';
import { MaintenanceSection } from 'src/entities/maintenancesection.entity';
import { Segment } from 'src/entities/segment.entity';
import { Sign } from 'src/entities/sign.entity';
import { SignStatus } from 'src/entities/signStatus.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
    countQuery,
    PaginationOptions,
    TypeOrmOrderedField,
} from '../utils/report.utils';

export enum SignReportOrderByProperties {
    groupId = 'groupId',
    districtName = 'districtName',
    officeName = 'officeName',
    countyName = 'countyName',
    groupName = 'groupName',
    agreementId = 'agreementId',
    agreementStatus = 'agreementStatus',
    segmentId = 'segmentId',
    segmentName = 'segmentName',
    signName = 'signName',
    signStatus = 'signStatus',
    statusBeginDate = 'statusBeginDate',
    statusEndDate = 'statusEndDate',
}

function _getSortName(property: string): TypeOrmOrderedField {
    switch (property) {
        case 'groupId':
            return {
                orderByField: 'gs.GROUP_ID',
            };
        case 'districtName':
            return {
                orderByField: 'd.NAME',
            };
        case 'officeName':
            return {
                orderByField: 'ms.NAME',
            };
        case 'countyName':
            return {
                orderByField: 'c.NAME',
            };
        case 'groupName':
            return {
                orderByField: 'gs.NAME',
            };
        case 'agreementId':
            return {
                orderByField: 'a.AGREEMENT_ID',
            };
        case 'agreementStatus':
            return {
                orderByField: 'a.STATUS',
            };
        case 'segmentId':
            return {
                orderByField: 'seg.AAH_SEGMENT_ID',
            };
        case 'segmentName':
            return {
                orderByField: 'seg.AAH_ROUTE_NAME',
            };
        case 'signName':
            return {
                orderByField: 's.LINE_1',
            };
        case 'signStatus':
            return {
                orderByField: 'ss.STATUS',
            };
        case 'statusBeginDate':
            return {
                orderByField: 'ss.BEGIN_DATE',
            };
        case 'statusEndDate':
            return {
                orderByField: 'ss.COMPLETION_DATE',
            };
        default:
            return { orderByField: undefined };
    }
}

export function GetAllActiveSignStatus(
    repo: Repository<Sign>,
): SelectQueryBuilder<Sign> {
    return repo
        .createQueryBuilder('s')
        .leftJoinAndSelect(
            (qb) =>
                qb
                    .from(SignStatus, 'ss1')
                    .select('SIGN_ID')
                    .addSelect('SIGN_STATUS_ID')
                    .addSelect(
                        'ROW_NUMBER() OVER(PARTITION BY ss1.SIGN_ID ORDER BY ss1.COMPLETION_DATE DESC)',
                        'latest',
                    ),
            't1',
            't1.SIGN_ID = s.SIGN_ID',
        )
        .innerJoinAndMapOne(
            's.signStatuses',
            SignStatus,
            'ss',
            't1.SIGN_STATUS_ID = ss.SIGN_STATUS_ID AND t1.latest = 1',
        )
        .leftJoinAndMapOne(
            's.agreement',
            Agreement,
            'a',
            's.AGREEMENT_ID = a.AGREEMENT_ID',
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
            'seg',
            'CAST(a.SEGMENT_ID as VARCHAR(255)) = CAST(seg.GlobalID AS VARCHAR(255))',
        )
        .leftJoinAndMapOne(
            'seg.district',
            District,
            'd',
            'seg.DIST_ABRVN = d.CODE',
        )
        .leftJoinAndMapOne(
            'seg.county',
            County,
            'c',
            'UPPER(seg.CNTY_NM) = UPPER(c.NAME)',
        )
        .leftJoinAndMapOne(
            'seg.maintenanceSection',
            MaintenanceSection,
            'ms',
            'seg.MNT_SEC_NBR = ms.NUMBER AND d.NUMBER = ms.DISTRICT_NUMBER',
        )
        .where('a.STATUS = :status', {
            status: 'ACTIVE',
        });
}

export async function PaginateAndOrderSignStatusReportDto(
    signs: SelectQueryBuilder<Sign>,
    mapper: Mapper,
    options: PaginationOptions,
): Promise<Pagination<SignReportDto>> {
    const sortName = _getSortName(options?.orderByOptions?.orderBy);

    const totalItems = await countQuery<Sign>(signs);

    // select if provided
    if (sortName.orderByField) {
        signs.addSelect(sortName.orderByField, 'o_ORDER_PROPERTY');
        signs.addOrderBy(
            'o_ORDER_PROPERTY',
            options.orderByOptions.orderByDirection,
        );
    }

    const [pagination, rawResults] = await paginateRawAndEntities(
        signs,
        options.paginationOptions,
    );

    pagination.items.forEach((item) => {
        const rawResult: any = rawResults.find(
            (raw: any) => raw.s_SIGN_ID === item.id,
        );
        const latestSignStatus = new SignStatus();
        latestSignStatus.id = rawResult?.ss_STATUS_ID;
        latestSignStatus.status = rawResult?.ss_STATUS;
        latestSignStatus.beginDate = rawResult?.ss_BEGIN_DATE;
        latestSignStatus.completionDate = rawResult?.ss_COMPLETION_DATE;
        latestSignStatus.comment = rawResult?.ss_COMMENT;
        item.latestSignStatus = latestSignStatus;
    });

    if (pagination.items.length == 0) {
        throw new HttpException('No records found', HttpStatus.NOT_FOUND);
    }

    const dto: SignReportDto[] = mapper.mapArray(
        pagination.items,
        SignReportDto,
        Sign,
    );

    return createPaginationObject<SignReportDto>({
        items: dto,
        totalItems: totalItems,
        currentPage: pagination.meta.currentPage,
        limit: pagination.meta.itemsPerPage,
    });
}
