import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterEvent } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, debounceTime, filter, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserProfile } from '../models/user-interface';
import { UsersEndpointsService } from './users-endpoints.service';

@Injectable({
  providedIn: 'root',
})
export class UsersAddService {
  private currentUrl;
  private user: UserProfile;
  saving = false;

  constructor(
    private http: HttpClient,
    private rptEndpoint: UsersEndpointsService,
    public snackBar: MatSnackBar,
    private router: Router,
  ) {
    router.events
      .pipe(filter((event) => event instanceof RouterEvent))
      .subscribe((e: RouterEvent) => {
        if (e && e.id > 0) {
          this.currentUrl = e.url;
        }
      });
  }

  createUser(formValues: any, dialogRef: any) {
    this.saving = true;
    return this.http
      .post<any>(environment.usersURL, formValues, {
        responseType: 'json',
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.saving = false;
          this.openSnackBar('User saved!', 'Success');
          dialogRef.close({ event: 'success' });

          return response;
        },
        error: (error): HttpErrorResponse => {
          console.log(error);
          this.saving = false;
          let cleanMessage = error.message.replace('received HTTP error: ', '');
          cleanMessage = cleanMessage.replaceAll(',', '\n');
          this.openSnackBar(cleanMessage, 'Error');

          return error;
        },
      });
  }

  updateUser(formValues: any, id: number, dialogRef: any) {
    console.log(formValues);
    this.saving = true;
    return this.http
      .patch<any>(`${environment.usersURL}/${id}`, formValues, {
        responseType: 'json',
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.saving = false;
          this.openSnackBar('User saved!', 'Success');
          dialogRef.close();

          return response;
        },
        error: (error): HttpErrorResponse => {
          console.log(error);
          this.saving = false;
          let cleanMessage = error.message.replace('received HTTP error: ', '');
          cleanMessage = cleanMessage.replaceAll(',', '\n');
          this.openSnackBar(cleanMessage, 'Error');

          return error;
        },
      });
  }

  getUserProfile(id: number): Observable<any> {
    const url = `${environment.usersProfileURL}/${id}/`;
    return this.http
      .get(url, {
        responseType: 'json',
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error(
            `UserProfileService: Error occured while requesting user data from ${url} Error: ${error} `,
          );
          throw new Error(
            `UserProfileService: Error occured while requesting user data from ${url} Error: ${error} `,
          );
        }),
        map((user: UserProfile) => user),
        debounceTime(1000),
      );
  }

  openSnackBar(message: string, action: string) {
    // const messageArr = cleanMessage.split('.');
    this.snackBar.open(message, action, {
      duration: 6000,
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }
}
