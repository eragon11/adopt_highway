export interface Segment {
  aahRouteName: string;
  txdotRouteName: string;
  segmentId: number;
  segmentStatus: string;
  agreementStatus: string;
  agreementStartDate: string;
  agreementEndDate: string;
  districtName: string;
  countyName: string;
  maintenanceOfficeName: string;
  segmentFromLat: number;
  segmentFromLong: number;
  segmentToLat: number;
  segmentToLong: number;
}
