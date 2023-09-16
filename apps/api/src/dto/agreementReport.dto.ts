import { AutoMap } from '@automapper/classes';

export class AgreementReportDto {
    @AutoMap()
    district: string;

    @AutoMap()
    county: string;

    @AutoMap()
    maintenanceOffice: string;

    @AutoMap()
    agreementId: number;

    @AutoMap()
    agreementStatus: string;

    @AutoMap()
    lengthOfTimeInProgram: string;

    @AutoMap()
    groupId: string;

    @AutoMap()
    groupName: string;

    @AutoMap()
    segmentId: string;

    @AutoMap()
    uniqueSegmentId: string;

    @AutoMap()
    segmentStatus: string;

    @AutoMap()
    agreementBeginDate: string;

    @AutoMap()
    agreementEndDate: string;

    @AutoMap()
    signText: string;

    @AutoMap()
    routeName: string;
}
