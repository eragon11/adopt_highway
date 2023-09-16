import { AutoMap } from '@automapper/classes';

export default class SignReportDto {
    @AutoMap()
    signName: string;

    @AutoMap()
    districtName: string;

    @AutoMap()
    officeName: string;

    @AutoMap()
    countyName: string;

    @AutoMap()
    groupId: number;

    @AutoMap()
    groupName: string;

    @AutoMap()
    agreementId: number;

    @AutoMap()
    agreementStatus: string;

    @AutoMap()
    segmentId: string;

    @AutoMap()
    segmentName: string;

    @AutoMap()
    statusBeginDate: Date;

    @AutoMap()
    statusEndDate: Date;

    @AutoMap()
    status: string;
}
