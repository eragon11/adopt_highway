import { Injectable } from '@angular/core';
import { AuthenticationService } from 'src/app/auth/_services';
import { environment } from 'src/environments/environment';
import { Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RoleType } from 'src/app/auth/_models/role-type';

@Injectable({
  providedIn: 'root',
})
//Used to retrieve the report endpoints. This could be a env file config however,
//part of the report endpoint is role based so the role must be determined on the fly
export class DataEndpointsService {
  private currentUrl;

  constructor(private auth: AuthenticationService, private router: Router) {
    router.events
      .pipe(filter((event) => event instanceof RouterEvent))
      .subscribe((e: RouterEvent) => {
        if (e && e.id > 0) {
          this.currentUrl = e.url;
        }
      });
  }

  getReportEndpoint(): string {
    const role = this.auth.getSelectedRoleType();
    let url;
    let uri;
    // Added in this switch statement so it can retrieve static uris from the env file
    switch (this.currentUrl) {
      case '/users/list-users': {
        uri = environment.userManagmentUri;
        url = `${environment.apiUrl}/${uri}`;
        break;
      }
      //The default is to build the uri for the reports which takes the current
      //url and appends the RoleType to it to form the API url
      default: {
        switch (role) {
          case RoleType.ReadOnlyUser:
          case RoleType.Administrator: {
            uri = environment.reportsAdminURLSuffix;
            break;
          }
          case RoleType.District: {
            uri = environment.reportsDistrictURLSuffix;
            break;
          }
          case RoleType.Maintenance: {
            uri = environment.reportsMaintURLSuffix;
            break;
          }
        }
        url = `${environment.apiUrl}${this.currentUrl}/${uri}`;
      }
    }
    return url;
  }

  getFullEndpoint(url: string): string {
    const role = this.auth.getSelectedRoleType();
    let uri;
    switch (role) {
      case RoleType.ReadOnlyUser:
      case RoleType.Administrator: {
        uri = environment.reportsAdminURLSuffix;
        break;
      }
      case RoleType.District: {
        uri = environment.reportsDistrictURLSuffix;
        break;
      }
      case RoleType.Maintenance: {
        uri = environment.reportsMaintURLSuffix;
        break;
      }
    }
    const tempURL = `${environment.apiUrl}${url}/${uri}`;
    return tempURL;
  }

  getCurrentURL(): string {
    return this.currentUrl;
  }
}
