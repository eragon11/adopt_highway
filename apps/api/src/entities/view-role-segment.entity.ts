import { ViewColumn, ViewEntity } from 'typeorm';

/**
 * View Entity contains all possible combinations of Roles, and Segments for joins to segment related entities
 */
@ViewEntity({
    schema: 'aah',
    expression: `SELECT * FROM aah.view_role_segment`,
})
export class ViewRoleSegment {
    @ViewColumn({ name: 'AAH_SEGMENT_ID' })
    aahSegmentId: string;

    @ViewColumn({ name: 'GlobalID' })
    globalId: string;

    @ViewColumn({ name: 'AAH_ROUTE_NAME' })
    aahRouteName: string;

    @ViewColumn({ name: 'CNTY_NBR' })
    countyNumber: number;

    @ViewColumn({ name: 'CNTY_NM' })
    countyName: string;

    @ViewColumn({ name: 'DIST_NBR' })
    distNumber: number;

    @ViewColumn({ name: 'DIST_NM' })
    districtName: string;

    @ViewColumn({ name: 'MNT_OFFICE_NM' })
    officeName: string;

    @ViewColumn({ name: 'MNT_SEC_NBR' })
    sectionNumber: number;

    @ViewColumn({ name: 'COUNTY_ID' })
    countyId: number;

    @ViewColumn({ name: 'DISTRICT_ID' })
    districtId: number;

    @ViewColumn({ name: 'ROLE_ID' })
    roleId: number;

    @ViewColumn({ name: 'USER_ID' })
    userId: number;

    @ViewColumn({ name: 'TYPE' })
    type: string;
}
