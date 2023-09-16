import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class UserDeleteService {
  private currentUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
      router.events
      .pipe(filter((event) => event instanceof RouterEvent))
      .subscribe((e: RouterEvent) => {
        if (e && e.id > 0) {
          this.currentUrl = e.url;
        }
      });
  }

  deleteUser(): Observable<unknown> {
    const deleteUrl = `${environment.apiUrl}${this.currentUrl}`;
    return this.http
        .delete(`${deleteUrl}`,  {
           withCredentials: true,
         })
        .pipe(
          catchError((error) => {
            console.error(
              `UserDeleteService: Error occurred while deleting the user from ${deleteUrl} Error: ${error} `,
            );
            throw new Error(
              `UserDeleteService: Error occurred while deleting the user from ${deleteUrl} Error: ${error} `,
            );
          })
        );
  }
}
