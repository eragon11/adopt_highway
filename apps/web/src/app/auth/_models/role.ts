import { Organization } from "./organization";
import { RoleType } from "./role-type";

export class Role {
    id: number;
    type: RoleType;
    organization: Organization;
}
