import { AutoMap } from '@automapper/classes';

export class GroupTypeInfoReportDto {
    @AutoMap()
    district: string;

    @AutoMap()
    county: string;

    @AutoMap()
    maintenanceOffice: string;

    @AutoMap()
    groupName: string;

    @AutoMap()
    groupType: string;

    @AutoMap()
    groupTypeCount: string;

    @AutoMap()
    percentageOfTotal: string;
}
