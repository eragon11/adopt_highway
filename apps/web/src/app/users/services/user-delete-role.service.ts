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
export class UserDeleteRoleService {
  private currentUrl;

  constructor(private http: HttpClient, private router: Router) {
    router.events
      .pipe(filter((event) => event instanceof RouterEvent))
      .subscribe((e: RouterEvent) => {
        if (e && e.id > 0) {
          this.currentUrl = e.url;
        }
      });
  }

  deleteRole(userId: number, roleId: number): Observable<unknown> {
    const deleteUrl = `${environment.apiUrl}/users/role/${userId}/${roleId}`;
    return this.http
      .delete(`${deleteUrl}`, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error(
            `UserDeleteRoleService: Error occurred while deleting the user role from ${deleteUrl} Error: ${error} `,
          );
          throw new Error(
            `UserDeleteRoleService: Error occurred while deleting the user role from ${deleteUrl} Error: ${error} `,
          );
        }),
      );
  }
}
