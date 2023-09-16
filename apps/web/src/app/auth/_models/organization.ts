import { District, MaintenanceSection, TxDot } from '.';

export class Organization {
  id: number;
  district: District;
  maintenanceSection: MaintenanceSection;
  groupSponsor: string;
  txdot: TxDot;
}
