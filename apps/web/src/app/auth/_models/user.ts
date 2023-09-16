import { Role } from './role';
import { RoleType } from './role-type';

export class User {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  status: string;
  email: string;
  selectedRole: number;
  roles: Array<Role>;

  public set Role(role: RoleType) {
    switch (role) {
      case RoleType.District: {
        //code to get district name
        break;
      }
      case RoleType.Maintenance: {
        break;
      }
      case RoleType.SignCoordinator: {
        break;
      }
      case RoleType.ReadOnlyUser:
      case RoleType.Administrator: {
        break;
      }
      case RoleType.Approver: {
        break;
      }
      default: {
        break;
      }
    }
  }
}
