import { AutoMap } from '@automapper/classes';
import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    schema: 'aah',
    expression: `SELECT * FROM aah.view_renewal_agreement`,
})
export class ViewRenewalAgreement {
    @AutoMap({ typeFn: () => Number })
    @ViewColumn({ name: 'AGREEMENT_ID' })
    agreementId: number;

    @AutoMap({ typeFn: () => Date })
    @ViewColumn({ name: 'AGREEMENT_END_DATE' })
    agreementEndDate: Date;

    @AutoMap()
    @ViewColumn({ name: 'GROUP_NAME' })
    groupName: string;

    @AutoMap()
    @ViewColumn({ name: 'DISTRICT_NAME' })
    districtName: string;

    @AutoMap()
    @ViewColumn({ name: 'OFFICE_NAME' })
    officeName: string;

    @AutoMap()
    @ViewColumn({ name: 'COUNTY_NAME' })
    countyName: string;

    @AutoMap()
    @ViewColumn({ name: 'AAH_ROUTE_NAME' })
    aahRouteName: string;

    @AutoMap()
    @ViewColumn({ name: 'AAH_SEGMENT_ID' })
    aahSegmentId: string;

    @AutoMap()
    @ViewColumn({ name: 'PICKUP_COUNT' })
    pickupCount: string;

    @AutoMap()
    @ViewColumn({ name: 'GlobalId' })
    globalId: string;

    @AutoMap()
    @ViewColumn({ name: 'RENEWAL_DAYS_REMAINING' })
    renewalDaysRemaining: string;

    @AutoMap({ typeFn: () => Number })
    @ViewColumn({ name: 'DISTRICT_NUMBER' })
    districtNumber: number;

    @AutoMap({ typeFn: () => Number })
    @ViewColumn({ name: 'OFFICE_NUMBER' })
    officeNumber: number;

    @AutoMap({ typeFn: () => Number })
    @ViewColumn({ name: 'COUNTY_NUMBER' })
    countyNumber: number;

    @AutoMap({ typeFn: () => Boolean })
    @ViewColumn({ name: 'RENEWAL_NOTICE_SENT' })
    renewalNoticeSent: boolean;
}
