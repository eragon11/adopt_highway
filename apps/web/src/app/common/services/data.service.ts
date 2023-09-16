import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, debounce, debounceTime, map } from 'rxjs/operators';
import { DataEndpointsService } from './data-endpoints.service';
import { Page } from 'src/app/common/models/page';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private http: HttpClient,
    private rptEndpoint: DataEndpointsService,
  ) {}

  getHTTPParams(pg: Page<any>): HttpParams {
    const orderCol = pg.getSortField();
    let orderDir = pg.getSortDirection();
    orderDir = orderDir ? orderDir : 'ASC';
    const recordsPerPage = pg.getPageSize();
    const currentPage = pg.getPageNumber();
    let gotDates = false;
    //look for date filters
    const filterDates = pg.getDateFilters();
    let beginDate;
    let endDate;

    if (filterDates) {
      beginDate = filterDates[0];
      endDate = filterDates[1];
      if (beginDate && endDate) {
        gotDates = true;
      }
    }
    //look for area filters
    const district = pg.getDistrict();
    const maintOffice = pg.getMaintOfc();
    const county = pg.getCounty();
    //Look for search string
    // TODO
    // Need to add the url parameters for search string and the booleans
    // for active user, include role type, etc.
    let httpParams = new HttpParams()
      .set('orderBy', orderCol)
      .set('orderByDirection', orderDir)
      .set('limit', recordsPerPage.toString())
      .set('page', currentPage.toString());
    if (gotDates) {
      httpParams = httpParams
        .append('beginDate', beginDate)
        .append('endDate', endDate);
    }
    if (district) {
      httpParams = httpParams.append('districtNumber', district);
    }
    if (maintOffice) {
      httpParams = httpParams.append('officeNumber', maintOffice);
    }
    if (county) {
      httpParams = httpParams.append('countyNumber', county);
    }
    return httpParams;
  }

  // Retrieves report data and metadata from the api
  // Uses generic types so it can be used for any report
  getReportData(pg: Page<any>): Observable<any> {
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
            `DataService:getReportData Error occured while requesting report data from ${url} Error: ${error} `,
          );
          throw new Error(
            `DataService:getReportData Error occured while requesting report data from ${url} Error: ${error} `,
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

  getReportCount(url: string, pg: Page<any>): Observable<number> {
    const fullURL = this.rptEndpoint.getFullEndpoint(url);
    const httpParams = this.getHTTPParams(pg);
    return this.http
      .get(fullURL, {
        params: httpParams,
        responseType: 'json',
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error(
            `DataService:getReportCount Error occured while requesting report count from ${url} Error: ${error} `,
          );
          throw new Error(
            `DataService:getReportCount Error occured while requesting report count from ${url} Error: ${error} `,
          );
        }),
        map((data: Response) => {
          const cnt = data['meta'].totalItems;
          return cnt as number;
        }),
      );
  }

  getCurrentURL(): string {
    return this.rptEndpoint.getCurrentURL();
  }
}
