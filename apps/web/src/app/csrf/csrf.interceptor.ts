import {
  HttpInterceptor,
  HttpXsrfTokenExtractor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfCookieInterceptor implements HttpInterceptor {
  cookieHeaderName = 'X-XSRF-TOKEN';

  constructor(private tokenExtractor: HttpXsrfTokenExtractor) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // skip for ignored request methods
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next.handle(req);
    }

    const csrfToken = this.tokenExtractor.getToken() as string;
    if (csrfToken !== null && !req.headers.has(this.cookieHeaderName)) {
      req = req.clone({
        headers: req.headers.set(this.cookieHeaderName, csrfToken),
      });
    }
    return next.handle(req);
  }
}
