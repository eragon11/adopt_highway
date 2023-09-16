import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../_services';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  refreshingToken = false;
  refreshingTokenTimeout = null;

  constructor(private authService: AuthenticationService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (
            event instanceof HttpResponse &&
            !this.refreshingToken &&
            !req.url.includes('/refresh') &&
            !req.url.includes('/whoami') &&
            this.authService.userSubject$.value
          ) {
            this.refreshingToken = true;
            this.authService.refreshToken().subscribe({
              complete: () => {
                clearTimeout(this.refreshingTokenTimeout);
                // To debounce refresh token on subsequent http calls after token is refreshed,
                // To avoid multiple refresh calls when there are multiple parallel / immediate http calls.
                this.refreshingTokenTimeout = setTimeout(
                  () => (this.refreshingToken = false),
                  environment.refreshTokenDebounceTimeInMinutes * 60 * 1000,
                );
              },
            });
          }
        },
      }),
    );
  }
}
