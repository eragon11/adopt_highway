import { Injectable, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../_models';
import { AuthenticationService } from '../_services';
import { RoleGuard } from './role.guard';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, OnInit {

  public user: User;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private roleGuard: RoleGuard
  ) {
    console.log('Calling AuthGuard');
    this.authenticationService.getUserValue().subscribe((data) => {
      this.user = data;
      console.log("in auth guard oninit with data " + data)
    })
  }

  ngOnInit(): void {

  }

  isUserSet(route: ActivatedRouteSnapshot) {
    this.authenticationService.userSubject$.subscribe(userObj => {
      if (userObj) {
        console.log("got selectedRole from user obj: " + userObj.selectedRole)
        if (!(userObj.selectedRole)) {
          this.router.navigate(['/selectrole'], { replaceUrl: true });
        }
      }
    })
  }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.authenticationService.isAuthenticated()
      .pipe(
        map( authed => {
          console.warn(`In canActivate with auth: ${authed}`)
          if (authed) {
            this.isUserSet(route)
            if (this.roleGuard.isAuthorized(route)) {
              console.warn(`Returning roleguard with true`)
              return true;
            } else {
              console.warn(`Returning roleguard with val:false`)
              return false;
            }
          } else {
            return false
          }
        })
      )
  }
}
