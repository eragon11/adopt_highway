import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, debounce, debounceTime, map } from 'rxjs/operators';
// TODO: DETERMINE IF WE SHOULD KEEP ALL THE USER LOGIC TIED TO USERS FOR NOW
import { DataEndpointsService } from 'src/app/common/services/data-endpoints.service';
import { Page } from 'src/app/common/models/page';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UsersDataService {
  constructor(
    private http: HttpClient,
    private rptEndpoint: DataEndpointsService,
  ) {}

  getHTTPParams(pg: Page<any>): HttpParams {
    const recordsPerPage = environment.defaultUsersPageSize;
    const currentPage = pg.getPageNumber();

    // look for area filters
    const district = pg.getDistrict();
    const maintOffice = pg.getMaintOfc();

    // Look for user name
    const userName = pg.getSearchName();

    // Look for user roles
    const userRoles = pg.getUserRoles();

    let httpParams = new HttpParams()
      .set('limit', recordsPerPage.toString())
      .set('page', currentPage.toString());

    if (district) {
      httpParams = httpParams.append('districtNumber', district);
    }
    if (maintOffice) {
      httpParams = httpParams.append('officeNumber', maintOffice);
    }
    if (userName) {
      httpParams = httpParams.append('fullNameContains', userName);
    }

    if (userRoles) {
      if (userRoles.length > 1) {
        for (let i = 0; i < userRoles.length; i++) {
           httpParams = httpParams.append(userRoles[i], 'true');
        }
      } else {
        httpParams = httpParams.append(userRoles.toString(), 'true');
      }
    }

    return httpParams;
  }

  getUsersData(pg: Page<any>): Observable<any> {
    const url = this.rptEndpoint.getReportEndpoint();
    const httpParams = this.getHTTPParams(pg);
    return this.http
      .get(url, {
        params: httpParams,
        responseType: 'json',
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error(
            `UsersDataService:getReportData Error occurred while requesting report data from ${url} Error: ${error} `,
          );
          throw new Error(
            `UsersDataService:getReportData Error occurred while requesting report data from ${url} Error: ${error} `,
          );
        }),
        map((data: Response) => {
          pg.setData(data['items']);
          pg.setMetaData(data['meta']);
          return pg as Page<any>;
        }),
        debounceTime(1000),
      );
  }

  getCurrentURL(): string {
    return this.rptEndpoint.getCurrentURL();
  }
}
