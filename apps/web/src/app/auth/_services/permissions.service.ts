import { Injectable, OnInit } from '@angular/core';
import { AuthenticationService } from '.';
import { RoleType } from '../_models/role-type';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  constructor(private authService: AuthenticationService) {}

  public permittedStatuses: Array<any>;

  private adopted = {
    label: 'Adopted',
    value: 'Adopted',
    class: 'adopted',
    selected: true,
    disabled: false,
    symbol: {
      type: 'simple-line',
      color: environment.adoptedStatusColor,
      width: environment.lineWidth4,
      style: environment.solidSymbol,
    },
  };

  private available = {
    label: 'Available',
    value: 'Available',
    class: 'available',
    selected: true,
    disabled: false,
    symbol: {
      type: 'simple-line',
      color: environment.availableStatusColor,
      width: environment.lineWidth5,
      style: environment.solidSymbol,
    },
  };

  private pending = {
    label: 'Pending',
    value: 'Pending',
    class: 'pending',
    selected: true,
    disabled: false,
    symbol: {
      type: 'simple-line',
      color: environment.pendingStatusColor,
      width: environment.lineWidth3,
      style: environment.solidSymbol,
    },
  };

  private unavailable = {
    label: 'Unavailable',
    value: 'Unavailable',
    class: 'unavailable',
    selected: true,
    disabled: false,
    symbol: {
      type: 'simple-line',
      color: environment.unavailableStatusColor,
      width: environment.lineWidth2,
      style: environment.solidSymbol,
    },
  };

  private deactivate = {
    label: 'Deactivate',
    value: 'Deactivate',
    class: 'deactivate',
    selected: true,
    disabled: false,
    symbol: {
      type: 'simple-line',
      color: environment.deactivateStatusColor,
      width: environment.lineWidth2,
      style: environment.solidSymbol,
    },
  };

  private notAssessed = {
    label: 'Not Assessed',
    value: 'Not Assessed',
    class: 'notAssessed',
    selected: true,
    disabled: false,
    symbol: {
      type: 'simple-line',
      color: environment.notAssessedStatusColor,
      width: environment.lineWidth2,
      style: environment.solidSymbol,
    },
  };

  private permissions = {
    roles: [
      {
        type: `${RoleType.Volunteer}`,
        entitled: [],
        updateStatusAllowed: [],
      },
      {
        type: `${RoleType.Administrator}`,
        entitled: [
          {
            resource: 'map',
            read: true,
            update: true,
          },
          {
            resource: 'reports',
            read: true,
          },
          {
            resource: 'agreements',
            create: true,
            read: true,
            update: true,
            delete: true,
            assignSegments: true,
          },
          {
            resource: 'users',
            create: true,
            read: true,
            update: true,
            delete: true,
          },
          {
            resource: 'AddSegment',
            create: true,
            read: true,
            update: true,
            delete: true,
          },
          {
            resource: 'UpdateSegment',
            create: true,
            read: true,
            update: true,
            delete: true,
          },
          {
            resource: 'areaFilter_District',
            update: true,
          },
          {
            resource: 'areaFilter_MaintenanceOffice',
            update: true,
          },
          {
            resource: 'areaFilter_County',
            update: true,
          },
          {
            resource: 'areaFilter_Route',
            update: true,
          },
        ],
        updateStatusAllowed: [
          this.available,
          this.adopted,
          this.pending,
          this.unavailable,
          this.deactivate,
          this.notAssessed,
        ],
      },
      {
        type: `${RoleType.ReadOnlyUser}`,
        entitled: [
          {
            resource: 'map',
            read: true,
            update: true,
          },
          {
            resource: 'reports',
            read: true,
            update: true,
            create: true,
            delete: true,
          },
          {
            resource: 'agreements',
            update: true,
            read: true,
            create: true,
            delete: true,
          },
          {
            resource: 'users',
            read: true,
          },
          {
            resource: 'AddSegment',
            create: false,
            read: false,
            update: false,
            delete: false,
          },
          {
            resource: 'UpdateSegment',
            create: false,
            read: false,
            update: false,
            delete: false,
          },
          {
            resource: 'areaFilter_District',
            update: true,
          },
          {
            resource: 'areaFilter_MaintenanceOffice',
            update: true,
          },
          {
            resource: 'areaFilter_County',
            update: true,
          },
          {
            resource: 'areaFilter_Route',
            update: true,
          },
        ],
        updateStatusAllowed: [
          this.available,
          this.adopted,
          this.pending,
          this.unavailable,
          this.deactivate,
          this.notAssessed,
        ],
      },
      {
        type: `${RoleType.District}`,
        entitled: [
          {
            resource: 'map',
            read: true,
            update: true,
          },
          {
            resource: 'reports',
            read: true,
          },
          {
            resource: 'agreements',
            create: true,
            read: true,
            update: true,
            delete: true,
            assignSegments: true,
          },
          {
            resource: 'users',
            read: true,
          },
          {
            resource: 'AddSegment',
            create: true,
            read: false,
            update: false,
            delete: false,
          },
          {
            resource: 'UpdateSegment',
            create: false,
            read: false,
            update: true,
            delete: false,
          },
          {
            resource: 'areaFilter_Route',
            update: true,
          },
          {
            resource: 'areaFilter_MaintenanceOffice',
            update: true,
          },
          {
            resource: 'areaFilter_County',
            update: true,
          },
        ],
        updateStatusAllowed: [
          this.available,
          this.adopted,
          this.pending,
          this.unavailable,
          this.notAssessed,
        ],
      },
      {
        type: `${RoleType.Maintenance}`,
        entitled: [
          {
            resource: 'map',
            read: true,
            update: true,
          },
          {
            resource: 'reports',
            read: true,
          },
          {
            resource: 'agreements',
            create: false,
            read: false,
            update: false,
            delete: false,
          },
          {
            resource: 'users',
            read: true,
          },
          {
            resource: 'AddSegment',
            create: false,
            read: false,
            update: false,
            delete: false,
          },
          {
            resource: 'UpdateSegment',
            create: false,
            read: false,
            update: true,
            delete: false,
          },
          {
            resource: 'areaFilter_Route',
            update: true,
          },
          {
            resource: 'areaFilter_County',
            update: true,
          },
        ],
        updateStatusAllowed: [
          this.available,
          this.adopted,
          this.pending,
          this.unavailable,
          this.notAssessed,
        ],
      },
    ],
  };

  isAuthorized(resource: string, action: string): boolean {
    const role = this.authService.getSelectedRoleType();
    let authed = false;
    this.permissions.roles.filter((type) => {
      if (type.type === role) {
        type.entitled.filter((ent) => {
          if (ent.resource === resource) {
            if (ent[action]) {
              authed = true;
            }
          }
        });
      }
    });
    if (!authed) {
      console.error(
        `Role: ${role} is not authorized for resource: ${resource}`,
      );
    }
    return authed;
  }

  getSegmentFilterWhereClause(showAllStatuses): string {
    let whereClause;
    const roleType = this.authService.getSelectedRoleType();
    switch (roleType) {
      case RoleType.ReadOnlyUser:
      case RoleType.Administrator: {
        const where = '';
        whereClause = where;
        break;
      }
      case RoleType.District: {
        let where = `${
          environment.Dist_Segment_WhereClause
        } '${this.authService.getDistrictCode()}'`;
        // Add the segment status where clause
        if (showAllStatuses) {
          where += ` and ${this.getPermittedStatusesWhereClause(
            this.getPermittedStatusValues(roleType),
          )}`;
          whereClause = where;
        } else {
          whereClause = where;
        }
        break;
      }
      case RoleType.Maintenance: {
        let whereMnt = `${
          environment.Maint_Segment_WhereClause
        } ${this.authService.getMaintOfficeNum()}`;
        let whereDst = ` AND ${
          environment.Dist_Maint_Segment_WhereClause
        } ${this.authService.getMaintDistrictAbr()}`;
        if (showAllStatuses) {
          whereMnt += whereDst += ` AND ${this.getPermittedStatusesWhereClause(
            this.getPermittedStatusValues(roleType),
          )}`;
          whereClause = whereMnt;
        } else {
          whereClause = whereMnt + whereDst;
        }
        break;
      }
      default: {
        //cant see any feature unless given explicit permission
        whereClause = '1=2';
      }
    }
    return whereClause;
  }

  getZoomWhereClause(): string {
    let whereClause;
    const roleType = this.authService.getSelectedRoleType();
    switch (roleType) {
      case RoleType.ReadOnlyUser:
      case RoleType.Administrator: {
        const where = `${environment.AdminWhereClause}`;
        console.log(`Admin Where clause: ${where}`);
        whereClause = where;
        break;
      }
      case RoleType.District: {
        const where = `${
          environment.DistrictWhereClause
        } '${this.authService.getDistrictCode()}'`;
        whereClause = where;
        break;
      }
      case RoleType.Maintenance: {
        // In order to identify a unique maintenance section the where clause must include BOTH the maintenance section id and a district identifier
        // We are using the district abbreviated name instead of the district id because the AAH_GIS_SEGMENT FS only has the DISTRICT_ABBREVIATION field
        let whereMnt = `${
          environment.Maint_WhereClause
        } ${this.authService.getMaintOfficeNum()}`;
        const whereDst = ` AND ${
          environment.MaintDistAbrWhereClause
        } ${this.authService.getMaintDistrictAbr()}`;
        whereClause = whereMnt += whereDst;
        break;
      }
      default: {
        //cant see any feature unless given explicit permission
        whereClause = '1=2';
      }
    }
    return whereClause;
  }

  getPermittedStatusesWhereClause(statuses: Array<string>): string {
    if (statuses.length > 0) {
      let statusStr = `${environment.statusWhereClause} (`;
      let i = 0;
      statuses.forEach((ele) => {
        if (i > 0) {
          statusStr += `,`;
        }
        statusStr += ` '${ele}'`;
        i++;
      });
      statusStr += `)`;
      return statusStr;
    } else {
      return '';
    }
  }

  getPermittedStatusValues(roleType: string): Array<string> {
    const returnArray = [];
    const status = this.permissions.roles.filter((attr) => {
      if (attr.type === roleType) {
        if (attr.updateStatusAllowed) {
          attr.updateStatusAllowed.forEach((ele) => {
            returnArray.push(ele.value);
          });
        }
        return returnArray;
      }
    });
    return returnArray;
  }

  getPermittedStatuses(): Array<string> {
    const role = this.authService.getSelectedRoleType();
    let status = [];
    this.permissions.roles.filter((attr) => {
      if (attr.type === role) {
        if (attr.updateStatusAllowed) {
          status = attr.updateStatusAllowed;
        }
      }
    });
    return status;
  }
}
