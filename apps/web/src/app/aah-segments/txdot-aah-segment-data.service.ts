import { Injectable } from '@angular/core';
//todo need to create a http error
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Segment } from './segment';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    //    Authorization: 'my-auth-token'
  }),
};

@Injectable()
export class TxdotAahSegmentDataService {
  private handleError: HandleError;

  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError(
      'TxdotAahSegmentDataService',
    );
  }

  getSegments(): Observable<Segment[]> {
    return this.http
      .get<Segment[]>(environment.aahDBRESTURL)
      .pipe(catchError(this.handleError<Segment[]>('getSegments', [])));
  }
}
