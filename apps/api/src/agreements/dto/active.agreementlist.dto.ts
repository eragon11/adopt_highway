import { AutoMap } from '@automapper/classes';

export class ActiveAgreementListDto {
    @AutoMap()
    agreementId: number;

    @AutoMap()
    startDate: string;

    @AutoMap()
    endDate: string;

    @AutoMap()
    groupName: string;

    @AutoMap()
    contactName: string;

    @AutoMap()
    contactEmail: string;

    @AutoMap()
    county: string;

    @AutoMap()
    countyNumber: number;

    @AutoMap()
    district: string;

    @AutoMap()
    districtNumber: number;

    @AutoMap()
    maintenanceSectionName: string;

    @AutoMap()
    maintenanceSectionNumber: number;

    @AutoMap()
    segmentName: string;

    @AutoMap()
    aahSegmentId: string;

    @AutoMap()
    status: string;

    @AutoMap()
    documentUrl: string;
}
