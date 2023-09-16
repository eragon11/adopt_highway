import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { District } from 'src/app/common/models/district';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { County } from 'src/app/common/models/county';
import { MaintOffice } from 'src/app/common/models/maintOffice';

@Injectable({
  providedIn: 'root',
})
export class AreaDataService {
  // Loading stream
  private readonly loading = new Subject<boolean>();
  public get loading$(): Observable<boolean> {
    return this.loading;
  }

  constructor(private http: HttpClient) {}

  getDistricts(): Observable<Array<District>> {
    const url = environment.districtsURL;
    return this.http
      .get(url, {
        responseType: 'json',
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error(
            `AreaDataService:getDistricts Error occured while requesting report data from ${url} Error: ${error} `,
          );
          throw new Error(
            `AreaDataService:getDistricts Error occured while requesting report data from ${url} Error: ${error} `,
          );
        }),
        tap(() => this.loading.next(true)),
        map((data: Array<District>) => {
          // console.warn(`Got district data: ${JSON.stringify(data)}`)
          console.log(data);
          return data;
        }),
      );
  }

  getMaintOffices(district?: string): Observable<Array<MaintOffice>> {
    const url = environment.maintOfcURL;
    // console.warn(`Making the maint offices http call with url: ${url}`)
    let httpParams = new HttpParams();
    if (district) {
      httpParams = httpParams.set('districtNumber', district);
    }
    console.warn(
      `in getMaintOffcs with url: ${url} and httpParams: ${JSON.stringify(
        httpParams,
      )}`,
    );
    return this.http
      .get(url, {
        params: httpParams,
        responseType: 'json',
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error(
            `AreaDataService:getMaintOffices Error occured while requesting report data from ${url} Error: ${error} `,
          );
          throw new Error(
            `AreaDataService:getMaintOffices Error occured while requesting report data from ${url} Error: ${error} `,
          );
        }),
        map((data: Array<MaintOffice>) => {
          console.log(data);
          return data;
        }),
      );
  }

  getCounties(district?: string, office?: string): Observable<Array<County>> {
    const url = environment.countiesURL;
    let httpParams = new HttpParams();
    if (district) {
      if (httpParams.keys().length > 0) {
        httpParams = httpParams.set('districtNumber', district);
      } else {
        httpParams = httpParams.append('districtNumber', district);
      }
    }
    if (office) {
      if (httpParams.keys().length > 0) {
        httpParams = httpParams.set('officeNumber', office);
      } else {
        httpParams = httpParams.append('officeNumber', office);
      }
    }
    return this.http
      .get(url, {
        params: httpParams,
        responseType: 'json',
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error(
            `AreaDataService:getCounties Error occured while requesting report data from ${url} Error: ${error} `,
          );
          throw new Error(
            `AreaDataService:getCounties Error occured while requesting report data from ${url} Error: ${error} `,
          );
        }),
        map((data: Array<County>) => {
          return data;
        }),
      );
  }

  ngOnDestroy() {
    this.loading.unsubscribe();
  }
}
