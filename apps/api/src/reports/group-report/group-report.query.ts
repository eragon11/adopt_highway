import { Mapper } from '@automapper/core';
import { HttpException, HttpStatus } from '@nestjs/common';
import {
    Pagination,
    createPaginationObject,
    paginateRawAndEntities,
} from 'nestjs-typeorm-paginate';
import { GroupReportDto } from 'src/dto/groupReport.dto';
import { Email, Phone } from 'src/entities';
import { Address } from 'src/entities/address.entity';
import { Agreement } from 'src/entities/agreement.entity';
import { County } from 'src/entities/county.entity';
import { District } from 'src/entities/district.entity';
import { GroupSponsor } from 'src/entities/groupSponsor.entity';
import { MaintenanceSection } from 'src/entities/maintenancesection.entity';
import { Segment } from 'src/entities/segment.entity';
import { Sign } from 'src/entities/sign.entity';
import { SignStatus } from 'src/entities/signStatus.entity';
import { User } from 'src/entities/user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
    TypeOrmOrderedField,
    PaginationOptions,
    ReportOptions,
} from '../utils/report.utils';

/**
 * Enumeration of properties for OpenAPI sorting
 */
export enum GroupReportOrderByProperties {
    agreementId = 'agreementId',
    agreementStartDate = 'agreementStartDate',
    agreementEndDate = 'agreementEndDate',
    agreementStatus = 'agreementStatus',
    groupId = 'groupId',
    groupName = 'groupName',
    groupType = 'groupType',
    countyName = 'countyName',
    districtName = 'districtName',
    maintenanceOfficeName = 'maintenanceOfficeName',
    segmentId = 'segmentId',
    segmentLength = 'segmentLength',
    segmentStatus = 'segmentStatus',
    signName = 'signName',
    isSignInstalled = 'isSignInstalled',
}

/**
 * Private function that returns a ORDER BY SQL field to be used in SQL queries for sorting.
 * Helps to populate the enumeration
 *
 * @param property string being sorted
 * @returns a SQL field to append to the sort
 */
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
        case 'agreementStartDate':
            return {
                orderByField: 'a.BEGIN_DATE',
            };
        case 'agreementEndDate':
            return {
                orderByField: 'a.END_DATE',
            };
        case 'groupId':
            return {
                orderByField: 'gs.GROUP_ID',
            };
        case 'groupName':
            return {
                orderByField: 'gs.NAME',
            };
        case 'groupType':
            return {
                orderByField: 'gs.TYPE',
            };
        case 'countyName':
            return {
                orderByField: 'c.NAME',
            };
        case 'districtName':
            return {
                orderByField: 'd.NAME',
            };
        case 'maintenanceOfficeName':
            return {
                orderByField: 'ms.NAME',
            };
        case 'segmentLength':
            return {
                orderByField: 'seg.SEGMENT_LENGTH_MILES',
            };
        case 'segmentId':
            return {
                orderByField: 'seg.AAH_SEGMENT_ID',
            };
        case 'segmentName':
            return {
                orderByField: 'seg.AAH_ROUTE_NAME',
            };
        case 'segmentStatus':
            return {
                orderByField: 'seg.SEGMENT_STATUS',
            };
        case 'isSignInstalled':
            return {
                orderByField: 'ss.STATUS',
            };
        default:
            return { orderByField: undefined };
    }
}

/**
 * Populates the group report
 * @param repo repository of Agreements
 * @returns  Returns all group report records for all groups
 */
export function GetAllAgreements(
    repo: Repository<Agreement>,
    reportOptions: ReportOptions,
): SelectQueryBuilder<Agreement> {
    const query = repo
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
            'a.groupSponsor',
            GroupSponsor,
            'gs',
            'a.GROUP_ID = gs.GROUP_ID',
        )
        .leftJoin('GROUP_CONTACTS', 'gc1', 'gc1.GROUP_ID = gs.GROUP_ID', null)
        .leftJoinAndMapOne(
            'gs.primaryContact',
            User,
            'pc',
            'gc1.IS_PRIMARY_CONTACT = 1 AND gc1.USER_ID = pc.USER_ID',
        )
        .leftJoinAndMapOne(
            'pc.primaryMailingAddress',
            Address,
            'pcma',
            "pc.USER_ID = pcma.USER_ID AND pcma.PRIMARY_CONTACT = 'Y' AND pcma.TYPE = 'Mailing'",
        )
        .leftJoinAndMapOne(
            'pc.primaryPhysicalAddress',
            Address,
            'pcpa',
            "pc.USER_ID = pcpa.USER_ID AND pcpa.PRIMARY_CONTACT = 'Y' AND pcpa.TYPE = 'Physical'",
        )
        .leftJoinAndSelect(
            (qb) =>
                qb
                    .from(User, 'pc1')
                    .addSelect('pc1.USER_ID', 'PC1_USER_ID')
                    .addSelect(
                        'COALESCE(pcma1.ADDRESS_LINE1, pcpa1.ADDRESS_LINE1)',
                        'PRIMARY_CONTACT_ADDRESS_LINE1',
                    )
                    .addSelect(
                        'COALESCE(pcma1.ADDRESS_LINE2, pcpa1.ADDRESS_LINE2)',
                        'PRIMARY_CONTACT_ADDRESS_LINE2',
                    )
                    .addSelect(
                        'COALESCE(pcma1.CITY, pcpa1.CITY)',
                        'PRIMARY_CONTACT_CITY',
                    )
                    .addSelect(
                        'COALESCE(pcma1.STATE, pcpa1.STATE)',
                        'PRIMARY_CONTACT_STATE',
                    )
                    .addSelect(
                        'COALESCE(pcma1.POSTAL_CODE, pcpa1.POSTAL_CODE)',
                        'PRIMARY_CONTACT_POSTAL_CODE',
                    )
                    .leftJoinAndMapOne(
                        'pc1.primaryMailingAddress',
                        Address,
                        'pcma1',
                        "pc1.USER_ID = pcma1.USER_ID AND pcma1.PRIMARY_CONTACT = 'Y' AND pcma1.TYPE = 'Mailing'",
                    )
                    .leftJoinAndMapOne(
                        'pc1.primaryPhysicalAddress',
                        Address,
                        'pcpa1',
                        "pc1.USER_ID = pcpa1.USER_ID AND pcpa1.PRIMARY_CONTACT = 'Y' AND pcpa1.TYPE = 'Physical'",
                    ),
            'pc1a',
            'pc1a.PC1_USER_ID = pc.USER_ID',
        )
        .leftJoinAndMapOne(
            'pc.primaryEmail',
            Email,
            'pce',
            "pc.USER_ID = pce.USER_ID AND pce.TYPE = 'Primary'",
        )
        .leftJoinAndMapOne(
            'pc.primaryPhone',
            Phone,
            'pcp',
            "pc.USER_ID = pcp.USER_ID AND pcp.TYPE = 'Primary'",
        )
        .leftJoin('GROUP_CONTACTS', 'gc2', 'gc2.GROUP_ID = gs.GROUP_ID', null)
        .leftJoinAndMapOne(
            'gs.secondaryContact',
            User,
            'sc',
            'gc2.IS_PRIMARY_CONTACT = 0 AND gc2.USER_ID = sc.USER_ID',
        )
        .leftJoinAndMapOne(
            'sc.primaryMailingAddress',
            Address,
            'scma',
            "sc.USER_ID = scma.USER_ID AND scma.PRIMARY_CONTACT = 'Y' AND scma.TYPE = 'Mailing'",
        )
        .leftJoinAndMapOne(
            'sc.primaryPhysicalAddress',
            Address,
            'scpa',
            "sc.USER_ID = scpa.USER_ID AND scpa.PRIMARY_CONTACT = 'Y' AND scpa.TYPE = 'Physical'",
        )
        .leftJoinAndSelect(
            (qb) =>
                qb
                    .from(User, 'sc1')
                    .addSelect('sc1.USER_ID', 'SC1_USER_ID')
                    .addSelect(
                        'COALESCE(scma1.ADDRESS_LINE1, scpa1.ADDRESS_LINE1)',
                        'SECONDARY_CONTACT_ADDRESS_LINE1',
                    )
                    .addSelect(
                        'COALESCE(scma1.ADDRESS_LINE2, scpa1.ADDRESS_LINE2)',
                        'SECONDARY_CONTACT_ADDRESS_LINE2',
                    )
                    .addSelect(
                        'COALESCE(scma1.CITY, scpa1.CITY)',
                        'SECONDARY_CONTACT_CITY',
                    )
                    .addSelect(
                        'COALESCE(scma1.STATE, scpa1.STATE)',
                        'SECONDARY_CONTACT_STATE',
                    )
                    .addSelect(
                        'COALESCE(scma1.POSTAL_CODE, scpa1.POSTAL_CODE)',
                        'SECONDARY_CONTACT_POSTAL_CODE',
                    )
                    .leftJoinAndMapOne(
                        'sc1.primaryMailingAddress',
                        Address,
                        'scma1',
                        "sc1.USER_ID = scma1.USER_ID AND scma1.PRIMARY_CONTACT = 'Y' AND scma1.TYPE = 'Mailing'",
                    )
                    .leftJoinAndMapOne(
                        'sc1.primaryPhysicalAddress',
                        Address,
                        'scpa1',
                        "sc1.USER_ID = scpa1.USER_ID AND scpa1.PRIMARY_CONTACT = 'Y' AND scpa1.TYPE = 'Physical'",
                    ),
            'sc1a',
            'sc1a.SC1_USER_ID = sc.USER_ID',
        )
        .leftJoinAndMapOne(
            'sc.primaryEmail',
            Email,
            'sce',
            "sc.USER_ID = sce.USER_ID AND sce.TYPE = 'Primary'",
        )
        .leftJoinAndMapOne(
            'sc.primaryPhone',
            Phone,
            'scp',
            "sc.USER_ID = scp.USER_ID AND scp.TYPE = 'Primary'",
        )
        .leftJoinAndMapOne(
            'a.sign',
            Sign,
            'sn',
            'a.AGREEMENT_ID = sn.AGREEMENT_ID',
        )
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
            't1.SIGN_ID = sn.SIGN_ID',
        )
        .innerJoinAndMapOne(
            's.signStatuses',
            SignStatus,
            'ss',
            't1.SIGN_STATUS_ID = ss.SIGN_STATUS_ID AND t1.latest = 1',
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
        .distinct(true);

    if (reportOptions.beginDate) {
        query.andWhere('a.BEGIN_DATE >= CAST(:beginDate as DATETIME2)', {
            beginDate: reportOptions.beginDate,
        });
    }

    if (reportOptions.endDate) {
        query.andWhere('a.BEGIN_DATE <= CAST(:endDate as DATETIME2)', {
            endDate: reportOptions.endDate,
        });
    }

    return query;
}

/**
 * Creates a paginated result of group report DTOs
 * @param query The Agreement query builder
 * @param mapper AutoMapper mapper object
 * @param options options for paginating the results
 * @returns a {GroupOrderDto} array with pagination metadata
 */
export async function PaginateAndOrderGroupReportDto(
    query: SelectQueryBuilder<Agreement>,
    mapper: Mapper,
    options: PaginationOptions,
): Promise<Pagination<GroupReportDto>> {
    const sortName = _getSortName(options?.orderByOptions?.orderBy);

    const totalItems = await query.getCount();

    // select if provided
    if (sortName.orderByField) {
        query.addSelect(sortName.orderByField, 'o_ORDER_PROPERTY');
        query.orderBy(
            'o_ORDER_PROPERTY',
            options.orderByOptions.orderByDirection,
        );
    }

    const [pagination, rawResults] = await paginateRawAndEntities(
        query,
        options.paginationOptions,
    );

    pagination.items.forEach((item) => {
        const rawResult: any = rawResults.find(
            (raw: any) => raw.a_AGREEMENT_ID === item.agreementId,
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

    const dto = mapper.mapArray(pagination.items, GroupReportDto, Agreement);
    return createPaginationObject<GroupReportDto>({
        items: dto,
        totalItems: totalItems,
        currentPage: pagination.meta.currentPage,
        limit: pagination.meta.itemsPerPage,
    });
}
