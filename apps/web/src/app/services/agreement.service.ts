/* eslint-disable prettier/prettier */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Agreement } from '../models/agreement.model';
import { Activeagreements } from '../models/activeAgreements.model';
import { Observable } from 'rxjs';
import { Page } from '../common/models/page';
import { catchError,  map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AgreementService {
  constructor(private http: HttpClient) {}

  getAgreementService() {
    return this.http.get<Agreement[]>(environment.apiUrl + '/applications',
     {withCredentials: true} )
}

getActiveAgreementService() {
  return this.http.get<Activeagreements[]>(environment.apiUrl + '/agreements/active',
   {withCredentials: true} )
}

getFilteredAgreements(pg: Page<any>): Observable<any> {
  const httpParams = this.getHTTPParams(pg);
  const url = environment.apiUrl + '/applications';
  return this.http.get(url, {
    params: httpParams,
    responseType: 'json',
    withCredentials: true,
  })
  .pipe(
    catchError((error) => {
      console.error(
        `AgreementService:getAgreemntData Error occurred while requesting agreements data from ${url} Error: ${error} `,
      );
      throw new Error(
        `AgreementService:getAgreemntData Error occurred while requesting agreements data from ${url} Error: ${error} `,
      );
    }),
    map((data: Response) => {
      pg.setData(data['items']);
      pg.setMetaData(data['meta']);
      return pg as Page<any>;
    }),
  );
}

getFilteredActiveAgreements(pg: Page<any>): Observable<any> {
  let httpParams = this.getHTTPParams(pg);
  const countyNumber = httpParams.get('requestedHighwayCountyNumber');
  if(countyNumber) {
    httpParams = httpParams.delete('requestedHighwayCountyNumber');
    httpParams = httpParams.append('countyNumber', countyNumber);
  }

  const url = environment.apiUrl + '/agreements/active';
  return this.http.get(url, {
    params: httpParams,
    responseType: 'json',
    withCredentials: true,
  })
  .pipe(
    catchError((error) => {
      console.error(
        `AgreementService:getAgreemntData Error occurred while requesting agreements data from ${url} Error: ${error} `,
      );
      throw new Error(
        `AgreementService:getAgreemntData Error occurred while requesting agreements data from ${url} Error: ${error} `,
      );
    }),
    map((data: Response) => {
      pg.setData(data['items']);
      pg.setMetaData(data['meta']);
      return pg as Page<any>;
    }),
  );
}
getAgreementDetails(agrrementId:string) {
  return this.http.get<Agreement[]>(environment.apiUrl + '/agreements/active/'+agrrementId, {
    responseType: 'json',
    withCredentials: true,
  })

}

getHTTPParams(pg: Page<any>): HttpParams {
  const currentPage = pg.getPageNumber();

  // look for area filters
  const district = pg.getDistrict();
  const county = pg.getCounty();

  // Look for user name
  const groupName = pg.getGroupName();

  let httpParams = new HttpParams()
    //.set('limit', recordsPerPage.toString())
    .set('page', currentPage.toString());

  if (district) {
    httpParams = httpParams.append('districtNumber', district);
  }
  if (county) {
    httpParams = httpParams.append('requestedHighwayCountyNumber', county);
  }
  if (groupName) {
    httpParams = httpParams.append('groupName', groupName);
  }

  return httpParams;
}

  getPDF(url : string)
    {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json'});
        return this.http.get(url, { headers : headers,responseType : 'blob' as 'json',
        withCredentials: true});
    }
}

