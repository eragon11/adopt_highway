//This is the user filter object which defines the overall user management filtering items
//this will need to have additional fields such as the booleand of Active, AdminRole, MCRole, etc.
export interface UsersFilter {
  district: string;
  maintOffice: string;
  userName: string;
  roles: string[];
}
