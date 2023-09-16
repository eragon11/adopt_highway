import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ArcgisTokenService {
  constructor(private http: HttpClient, public snackBar: MatSnackBar) {}

  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      politeness: 'polite',
      announcementMessage: 'The map features could not be loaded',
      duration: 6000,
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }

  getToken(): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/gis-token`, {
        params: new HttpParams().set('appUrl', window.location.href),
        responseType: 'json',
        withCredentials: true,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (
            error.message ===
            'received HTTP error 500: Mapping features are currently unavailable'
          ) {
            this.openSnackBar(
              'There was a problem with our map service. The map features are not currently available.',
              'Error',
            );
          }
          console.error(`${error.message}`);
          throw new Error(`${error}`);
        }),
        map((data: Response) => {
          return data;
        }),
      );
  }
}
