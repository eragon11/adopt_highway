/* eslint-disable prettier/prettier */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Agreement } from '../../models/agreement.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PickupService {
  saving = false;

  constructor(private http: HttpClient, public snackBar: MatSnackBar) {}

  getPickupsforAgreement(
    agrrementId: string,
    page: number,
    limit: number,
    orderBy: string,
    orderByDirection: string,
  ) {
    const params = {
      id: agrrementId,
      page: page,
      limit: limit,
      orderBy: orderBy,
      orderByDirection: orderByDirection,
    };
    return this.http.get<Agreement[]>(
      environment.apiUrl + '/agreements/pickups',
      {
        params: params,
        responseType: 'json',
        withCredentials: true,
      },
    );
  }

  createPickup(formValues: any, agreementId: number, dialogRef: any) {
    this.saving = true;
    return this.http
      .post<any>(
        `${environment.apiUrl}/pickups?agreementId=${agreementId}`,
        formValues,
        {
          responseType: 'json',
          withCredentials: true,
        },
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          this.saving = false;
          this.openSnackBar('Pickup saved!', 'Success');
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

  updatePickup(formValues: any, pickupId: number, dialogRef: any) {
    console.log(formValues);
    this.saving = true;
    return this.http
      .patch<any>(`${environment.apiUrl}/pickups?id=${pickupId}`, formValues, {
        responseType: 'json',
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.saving = false;
          this.openSnackBar('Pickup saved!', 'Success');
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

  deletePickup(pickupId: number, dialogRef: any) {
    const deleteUrl = `${environment.apiUrl}/pickups?id=${pickupId}`;
    return this.http
      .delete(`${deleteUrl}`, {
        withCredentials: true,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.saving = false;
          this.openSnackBar('Pickup deleted!', 'Success');
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

  openSnackBar(message: string, action: string) {
    // const messageArr = cleanMessage.split('.');
    this.snackBar.open(message, action, {
      duration: 6000,
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }
}
