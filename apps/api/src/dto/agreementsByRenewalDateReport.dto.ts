import { AutoMap } from '@automapper/classes';
export class AgreementsByRenewalDateReportDto {
    @AutoMap({ typeFn: () => String })
    renewalTimeFrame: string;

    @AutoMap()
    district: string;

    @AutoMap()
    county: string;

    @AutoMap()
    maintenanceOffice: string;

    @AutoMap()
    agreementId: number;

    @AutoMap()
    groupId: number;

    @AutoMap()
    groupName: string;

    @AutoMap()
    agreementInfo: string;

    @AutoMap()
    agreementStartDate: string;

    @AutoMap()
    agreementEndDate: string;

    @AutoMap()
    totalNumberOfPickupsPerAgreementTimeline: number;

    @AutoMap()
    numberOfMissedPickups: number;
}
