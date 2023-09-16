export interface User {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  roles: any;
  status: string;
  addresses: any;
  emails: any;
  phones: any;
  lastLogin: Date;
}

interface Role {
  roleType: string;
  districtNumber: number;
  officeNumber: number;
}
export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  contactNumber: string;
  status: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  roles: Role[];
  addresses: any;
  emails: any;
  phones: any;
  lastLogin: Date;
}
