export interface GroupReport {
  agreementStartDate: string;
  agreementEndDate: string;
  agreementId: number;
  agreementStatus: string;
  countyName: string,
  districtName: string,
  maintenanceOfficeName: string,
  groupId: number;
  groupName: string;
  groupType: string;
  primaryContactName: string;
  primaryContactAddress: string;
  primaryContactCity: string;
  primaryContactState: string;
  primaryContactPostalCode: number;
  primaryContactEmail: string;
  primaryContactPhone: number;
  secondaryContactName: string;
  secondaryContactAddress: string;
  secondaryContactCity: string;
  secondaryContactState: string;
  secondaryContactPostalCode: string;
  secondaryContactPhone: string;
  secondaryContactEmail: string;
  segmentLength: number;
  isSignInstalled: string;
}
