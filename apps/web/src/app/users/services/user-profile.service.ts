import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { map, catchError, debounceTime } from 'rxjs/operators';
import { Router, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user-interface';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private currentUrl;
  private user: User;

  constructor(private http: HttpClient, private router: Router) {
    router.events
      .pipe(filter((event) => event instanceof RouterEvent))
      .subscribe((e: RouterEvent) => {
        if (e && e.id > 0) {
          this.currentUrl = e.url;

        }
      });
  }

  getUserProfile(): Observable<any> {
    const url = `${environment.apiUrl}${this.currentUrl}/`;
    return this.http
      .get(url, {
        responseType: 'json',
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error(
            `UserProfileService: Error occurred while requesting user data from ${url} Error: ${error} `,
          );
          throw new Error(
            `UserProfileService: Error occurred while requesting user data from ${url} Error: ${error} `,
          );
        }),
        map((user: User) => user),
        debounceTime(1000),
      );
  }
}
