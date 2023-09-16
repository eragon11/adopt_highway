import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { GroupTypeInfoReportDto } from 'src/dto/groupTypeInfoReport.dtos';
import {
    SqlClauses,
    ParseGroupTypeReportSqlClausesToSql,
    CreateOrderedSql,
    AppendPaginationOffsetToSql,
    GetTotalCount as GetTotalCount,
    PaginateArray,
} from 'src/utils/query/query.utils';
import { Connection } from 'typeorm';
import { ReportOptions } from '../utils/report.utils';

/**
 * enumeration for listing sortable properties for GroupTypeInfoReport
 */
export enum GroupTypeInfoReportOrderByProperties {
    type = 'type',
}

/**
 * Creates the default SQL clauses for a query
 * using the SqlClauses interface
 */
class GroupTypeInfoReportSqlClausesMap implements SqlClauses {
    select: Map<string, string> = new Map<string, string>();
    from: Map<string, string> = new Map<string, string>();
    where: Map<string, string> = new Map<string, string>();
    groupBy: Map<string, string> = new Map<string, string>();
    orderBy: Map<string, string> = new Map<string, string>();

    constructor() {
        this.select.set('select_type', 'gs.TYPE as[type]');
        this.select.set('select_countOfType', 'COUNT(TYPE) as [countOfType]');
        this.select.set(
            'select_percentageOfType',
            "CONCAT(FLOOR(CAST(COUNT(TYPE) AS decimal)*100/(SELECT COUNT(*) FROM aah.GROUP_SPONSOR gs1 LEFT JOIN aah.AGREEMENT a1 on gs1.GROUP_ID = a1.GROUP_ID WHERE a1.STATUS = 'ACTIVE')), '%') AS [percentageOfType]",
        );
        this.from.set('from_group_sponsor', 'aah.GROUP_SPONSOR gs');
        this.from.set(
            'from_agreement',
            'LEFT JOIN aah.AGREEMENT a on gs.GROUP_ID = a.GROUP_ID',
        );
        this.from.set(
            'from_segments',
            'LEFT JOIN gis.AAH_GIS_SEGMENTS s on a.SEGMENT_ID = CAST(s.GlobalID as varchar(50))',
        );
        this.groupBy.set('groupBy_type', 'gs.TYPE');
        this.where.set('where_agreement_active', "a.STATUS = 'ACTIVE'");
    }
}

/**
 * Creates a GroupTypeInfoReport object
 * @param reportOptions
 * @returns {GroupTypeInfoReportSqlClausesMap}
 */
function createGroupTypeInfoSqlClausesMap(
    sqlClauses: SqlClauses,
    reportOptions: ReportOptions,
): GroupTypeInfoReportSqlClausesMap {
    if (reportOptions.beginDate) {
        sqlClauses.where.set(
            'where_begin_date',
            `AND a.BEGIN_DATE >= 'CAST(${reportOptions.beginDate} as DATETIME2)'`,
        );
    }

    if (reportOptions.endDate) {
        sqlClauses.where.set(
            'where_end_date',
            `AND a.END_DATE <= 'CAST(${reportOptions.endDate} as DATETIME2)'`,
        );
    }

    if (reportOptions.districtNumber > 0) {
        // reset the percentage of type to one that tallies for districts
        sqlClauses.select
            .set('select_dist_nm', 's.DIST_NM AS [districtName]')
            .set('select_dist_nbr', 's.DIST_NBR AS [districtNumber]')
            .set(
                'select_percentageOfType',
                `CONCAT(FLOOR(CAST(COUNT(TYPE) AS decimal)*100/(SELECT COUNT(*) FROM aah.GROUP_SPONSOR gs1 LEFT JOIN aah.AGREEMENT a1 on gs1.GROUP_ID = a1.GROUP_ID LEFT JOIN gis.AAH_GIS_SEGMENTS s1 on a1.SEGMENT_ID = CAST(s1.GlobalID as varchar(50))  WHERE a1.STATUS = 'ACTIVE' AND s1.DIST_NBR = ${reportOptions.districtNumber})), '%') AS [percentageOfType]`,
            );

        sqlClauses.where.set(
            'where_dist_nbr',
            ` AND s.DIST_NBR = ${reportOptions.districtNumber}`,
        );
        sqlClauses.groupBy
            .set('groupby_dist_nm', `s.DIST_NM`)
            .set('groupby_dist_nbr', `s.DIST_NBR`);
    }

    if (reportOptions.officeNumber > 0) {
        // reset the percentage of type to one that tallies for district AND maint sec numbers
        sqlClauses.select
            .set('select_maint_sec_nm', 's.MNT_OFFICE_NM AS [officeName]')
            .set('select_maint_sec_nbr', 's.MNT_SEC_NBR AS [officeNumber]')
            .set(
                'select_percentageOfType',
                `CONCAT(FLOOR(CAST(COUNT(TYPE) AS decimal)*100/(SELECT COUNT(*) FROM aah.GROUP_SPONSOR gs1 LEFT JOIN aah.AGREEMENT a1 on gs1.GROUP_ID = a1.GROUP_ID LEFT JOIN gis.AAH_GIS_SEGMENTS s1 on a1.SEGMENT_ID = CAST(s1.GlobalID as varchar(50))  WHERE a1.STATUS = 'ACTIVE' AND s1.DIST_NBR = ${reportOptions.districtNumber} AND s1.MNT_SEC_NBR = ${reportOptions.officeNumber})), '%') AS [percentageOfType]`,
            );

        sqlClauses.where
            .set(
                'where_dist_nbr',
                ` AND s.dist_nbr = ${reportOptions.districtNumber}`,
            )
            .set(
                'where_mnt_sec_nbr',
                ` AND s.MNT_SEC_NBR = ${reportOptions.officeNumber}`,
            );

        sqlClauses.groupBy
            .set('groupby_dist_nm', `s.DIST_NM`)
            .set('groupby_dist_nbr', `s.DIST_NBR`)
            .set('groupby_mnt_office_nm', `s.MNT_OFFICE_NM`)
            .set('groupby_mnt_sec_nbr', `s.MNT_SEC_NBR`);
    }

    if (reportOptions.countyNumber > 0) {
        // reset the percentage of type to one that tallies for district AND maint sec numbers AND county numbers
        sqlClauses.select
            .set('select_county_nm', 's.MNT_OFFICE_NM AS [countyName]')
            .set('select_county_nbr', 's.CNTY_NBR AS [countyNumber]')
            .set(
                'select_percentageOfType',
                `CONCAT(FLOOR(CAST(COUNT(TYPE) AS decimal)*100/(SELECT COUNT(*) FROM aah.GROUP_SPONSOR gs1 LEFT JOIN aah.AGREEMENT a1 on gs1.GROUP_ID = a1.GROUP_ID LEFT JOIN gis.AAH_GIS_SEGMENTS s1 on a1.SEGMENT_ID = CAST(s1.GlobalID as varchar(50))  WHERE a1.STATUS = 'ACTIVE' AND s1.DIST_NBR = ${reportOptions.districtNumber} AND s1.MNT_SEC_NBR = ${reportOptions.officeNumber} AND s1.CNTY_NBR = ${reportOptions.countyNumber})), '%') AS [percentageOfType]`,
            );

        sqlClauses.where
            .set(
                'where_dist_nbr',
                ` AND s.dist_nbr = ${reportOptions.districtNumber}`,
            )
            .set(
                'where_mnt_sec_nbr',
                ` AND s.MNT_SEC_NBR = ${reportOptions.officeNumber}`,
            )
            .set(
                'where_cnty_nbr',
                ` AND s.CNTY_NBR = ${reportOptions.countyNumber}`,
            );

        sqlClauses.groupBy
            .set('groupby_dist_nm', `s.DIST_NM`)
            .set('groupby_dist_nbr', `s.DIST_NBR`)
            .set('groupby_mnt_office_nm', `s.MNT_OFFICE_NM`)
            .set('groupby_mnt_sec_nbr', `s.MNT_SEC_NBR`)
            .set('groupby_county_nm', `s.CNTY_NM`)
            .set('groupby_county_nbr', `s.CNTY_NBR`);
    }

    if (reportOptions.options.orderByOptions.orderBy) {
        sqlClauses.orderBy.set(
            'orderby',
            `${reportOptions.options.orderByOptions.orderBy} ${reportOptions.options.orderByOptions.orderByDirection}`,
        );
    }

    return sqlClauses;
}

/**
 *  Returns paginated Group Type Info Report objects
 * @param connection
 * @param reportOptions
 * @returns {Pagination<GroupTypeInfoReportDto>} a paginated array of GroupTypeInfoReportDto objects
 */
export async function GetAllActiveGroupTypeInfos(
    connection: Connection,
    reportOptions: ReportOptions,
): Promise<Pagination<GroupTypeInfoReportDto>> {
    try {
        const groupInfoReport: GroupTypeInfoReportSqlClausesMap =
            createGroupTypeInfoSqlClausesMap(
                new GroupTypeInfoReportSqlClausesMap(),
                reportOptions,
            );

        const sqlClausesFunc = (
            groupInfoReport: GroupTypeInfoReportSqlClausesMap,
        ) => ParseGroupTypeReportSqlClausesToSql(groupInfoReport);

        // get our ordered and paginated SQL
        const orderedSql = CreateOrderedSql(
            sqlClausesFunc,
            groupInfoReport,
            reportOptions,
        );

        const page =
            Number(reportOptions.options?.paginationOptions?.page) ?? 1;
        const limit =
            Number(reportOptions.options?.paginationOptions?.limit) ?? 10;
        const paginatedSql = AppendPaginationOffsetToSql(
            orderedSql,
            page,
            limit,
        );

        // get our total count
        const sql = ParseGroupTypeReportSqlClausesToSql(groupInfoReport);
        const count = await GetTotalCount(connection, sql);

        // get our DTOs
        const queryRunner = connection.createQueryRunner();
        const dto: GroupTypeInfoReportDto[] = await queryRunner.query(
            paginatedSql,
        );

        if (dto.length == 0) {
            throw new HttpException(
                'No records returned',
                HttpStatus.NOT_FOUND,
            );
        }

        // return a paginated array
        return PaginateArray<GroupTypeInfoReportDto>(
            dto,
            count,
            Number(reportOptions.options.paginationOptions.page),
            Number(reportOptions.options.paginationOptions.limit),
        );
    } catch (error: any) {
        if (error instanceof HttpException) {
            throw error;
        }
        Logger.error((error as Error).stack, 'Group Type Report');
        throw new HttpException(
            'Server error',
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
