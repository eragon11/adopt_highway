export interface AgreementsByRenewalReport {
  renewalTimeFrame: string;
  district: string;
  county: string;
  maintenanceOffice: string;
  id: number;
  groupId: number;
  groupName: string;
  agreementInfo: string;
  agreementStartDate: string;
  agreementEndDate: string;
  totalNumberOfPickupsPerAgreementTimeline: number;
  numberOfMissedPickups: number;
}
