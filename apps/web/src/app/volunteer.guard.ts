import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoleType } from './auth/_models';
import { AuthenticationService } from './auth/_services';

@Injectable({
  providedIn: 'root',
})
export class VolunteerGuard implements CanActivate {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isAuthenticated().pipe(
      map((isAuthenticated) => {
        if (
          isAuthenticated &&
          this.authService.getSelectedRoleType() === RoleType.Volunteer
        ) {
          return true;
        } else {
          return this.router.parseUrl('/');
        }
      }),
    );
  }
}
