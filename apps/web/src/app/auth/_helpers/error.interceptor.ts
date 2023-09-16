import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from './../_services';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        console.log(
          'in interceptor got a status of: ' +
            (err as HttpErrorResponse).status,
        );
        const error = err.error.message || err.statusText;
        switch (err.status) {
          case 401: {
            console.log('Got Access Denied ' + err.message);
            this.authenticationService.login();
          }
          case 404: {
            console.log('No records found' + err.message);
            throw new Error (`received HTTP error 404: ${error}`);
          }
          case 403: {
            this.router.navigate(['/access-denied']);
            console.error(`received HTTP error 403: ${error}`);
            throw new Error (`received HTTP error 403: ${error}`);
          }
          case 500: {
            throw new Error(`received HTTP error 500: ${error}`);
          }
          default: {
            throw new Error(`received HTTP error: ${error}`);
          }
        }
      }),
    );
  }
}
