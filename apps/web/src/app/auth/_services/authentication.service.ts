import { Injectable } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { Role, User } from './../_models';
import { RoleType } from '../_models/role-type';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  public userSubject$: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  errorMsg: string;
  private routerState: RouterEvent = null;
  private user: User;

  constructor(private router: Router, private http: HttpClient) {
    this.getUserValue().subscribe((data) => {
      if (data) {
        this.user = data;
      }
    });
  }

  /**
   * Statewide roles are Administrator and ReadOnlyUser
   * @returns true when the current selected role is a statewide role
   */
  isStateWideRole(): boolean {
    const stateWideRoles: string[] = [
      RoleType.Administrator,
      RoleType.ReadOnlyUser,
    ];
    if (stateWideRoles.includes(this.getSelectedRoleType())) {
      return true;
    } else {
      return false;
    }
  }

  getUserValue(): BehaviorSubject<User> {
    return this.userSubject$;
  }

  getUserName(): string {
    return this.user.userName;
  }

  getSelectedRole(): Role {
    if (this.user) {
      let srole = this.user.selectedRole;
      let foundRole: Role = null;
      if (srole) {
        this.user.roles.filter((ele) => {
          if (ele.id == srole) {
            foundRole = ele;
          }
        });
      }
      return foundRole;
    } else {
      return null;
    }
  }

  getSelectedRoleType(): string {
    let role: Role = this.getSelectedRole();
    if (role) {
      return role?.type;
    } else {
      return null;
    }
  }

  getSelectedRoleTypeFull(): string {
    let roleStr;
    let role: Role = this.getSelectedRole();
    if (role) {
      roleStr = role?.type;
      if (roleStr === RoleType.District) {
        roleStr += ` - ${role.organization.district.name}`;
      } else if (roleStr === RoleType.Maintenance) {
        roleStr += ` - ${role.organization.maintenanceSection.name}`;
      }
    }
    return roleStr;
  }

  getDistrictCode(): string {
    let roleid = this.getSelectedRole().id;
    let dcCode;
    this.userSubject$.value.roles.filter((ele) => {
      if (ele.id == roleid) {
        dcCode = ele.organization.district.code;
      }
    });
    return dcCode;
  }

  getDistrictNumber(): number {
    let roleid = this.getSelectedRole().id;
    let roleType = this.getSelectedRoleType();
    let dcCode;
    this.userSubject$.value.roles.filter((ele) => {
      console.log(
        `Getting district number with roleid ${roleid} and ele ${JSON.stringify(
          ele,
        )}`,
      );
      if (ele.id == roleid) {
        switch (roleType) {
          case RoleType.ReadOnlyUser:
          case RoleType.Administrator: {
            dcCode = null;
            break;
          }
          case RoleType.District: {
            dcCode = ele.organization.district.number;
            break;
          }
          case RoleType.Maintenance: {
            dcCode = ele.organization.maintenanceSection.districtNumber;
            break;
          }
        }
      }
    });
    return dcCode;
  }

  getMaintDistrictAbr(): string {
    const roleid = this.getSelectedRole().id;
    let districAbr;
    this.userSubject$.value.roles.filter((ele) => {
      if (ele.id == roleid) {
        districAbr =
          "'" + ele.organization.maintenanceSection.districtName + "'";
      }
    });
    return districAbr;
  }

  getMaintOfficeNum(): string {
    const roleid = this.getSelectedRole().id;
    let moNum;
    this.userSubject$.value.roles.filter((ele) => {
      if (ele.id == roleid) {
        moNum = ele.organization.maintenanceSection.number;
      }
    });
    return moNum;
  }

  updateUserRole(role: Role) {
    let user = this.userSubject$.value;
    user.roles[user.selectedRole] = role;
    this.userSubject$.next(user);
  }

  setRole(id: number): Observable<boolean> {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'text/plain');
    headers.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    const str = '{ "roleId": ' + id + '}';
    console.log('json: ' + str);
    const postBody = JSON.parse(str);
    console.log('postBody: ' + JSON.stringify(postBody));
    return this.http
      .post<User>(environment.setRoleUrl, postBody, {
        headers: headers,
        withCredentials: true,
        observe: 'body',
      })
      .pipe(
        map((ret) => {
          console.log(`in setRole with return :${JSON.stringify(ret)}:`);
          const localUser = this.userSubject$.value;
          console.log(`in setRole setting id to :${id}:`);
          localUser.selectedRole = id;
          sessionStorage.setItem('currentUser', JSON.stringify(localUser));
          this.userSubject$.next(localUser);
          console.log(
            `updated user with new role ${JSON.stringify(
              this.userSubject$.value,
            )}`,
          );
          console.log('role updated');
          this.router.navigate(['/']);
          return true;
        }),
        catchError((error) => {
          console.error(
            'Error occured posting to the api trying to set role: ' + error,
          );
          return of(false);
        }),
      );
  }

  isAuthenticated(): Observable<boolean> {
    return this.http
      .get<User>(environment.WhoAmIUrl, { withCredentials: true })
      .pipe(
        map((user) => {
          if (user) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            this.userSubject$.next(user);
            return true;
          } else {
            console.error(
              `Error on isAuthenticated: User is not authenticated`,
            );
            return false;
          }
        }),
        catchError((error) => {
          console.error(`Error on isAuthenticated ${JSON.stringify(error)}`);
          return of(false);
        }),
      );
  }

  refreshToken(): Observable<boolean> {
    return this.http
      .get<User>(environment.RefreshTokenUrl, { withCredentials: true })
      .pipe(
        map(() => {
          this.userSubject$.next(this.userSubject$.value);
          return true;
        }),
        catchError((error) => {
          console.error(`Error on refreshing token ${JSON.stringify(error)}`);
          return of(false);
        }),
      );
  }

  login() {
    this.router.navigate(['/auth/login']);
  }

  logout() {
    localStorage.setItem('navigateURL', '');
    window.location.href = environment.logoutUrl;
  }
}
