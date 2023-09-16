import { Injectable, OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services';
import { PermissionsService } from '../_services/permissions.service';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard {

  constructor(
    private permissions: PermissionsService,
    public authService: AuthenticationService
  ) { }

  //originally, this was a guard implementing canActivate. However, it required the user
  //observable to be set before it could evaluate so now this must be called withing the
  //auth guard canActivate
  isAuthorized(route: ActivatedRouteSnapshot): boolean {
      let resource;
      let action;
      if (route.data["resourceAction"]) {
        resource = route.data["resourceAction"][0];
        action = route.data["resourceAction"][1];
      } else {
        console.error(`In RoleGuard:CanActivate: no data to check roles`);
        return false;
      }
      if (this.permissions.isAuthorized(resource, action)) {
        console.warn(`Authorized: setting response to true`)
        return true;
      } else {
        console.warn(`NOT Authorized: setting response to false`)
        return false
      }    
  }

}
