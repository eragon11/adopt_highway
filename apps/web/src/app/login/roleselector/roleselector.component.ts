import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/auth/_services';
import { User } from '../../auth/_models';
import { RoleType } from '../../auth/_models/role-type';
import { SidenavService } from '../../sidenav/sidenav.service';

@Component({
  selector: 'app-roleselector',
  templateUrl: './roleselector.component.html',
})
export class RoleselectorComponent implements OnInit {
  public roletype = RoleType;
  public user: User;
  navigateURL = '';

  constructor(
    public auth: AuthenticationService,
    private router: Router,
    public sideNavService: SidenavService,
  ) {}

  ngOnInit(): void {
    this.auth.getUserValue().subscribe((data) => {
      this.user = data;
    });
    this.navigateURL = localStorage.getItem('navigateURL');
  }

  setRole(event) {
    this.sideNavService.closeSideNav();
    this.auth.setRole(event.value).subscribe(() => {
      //need to determine if this is the 1st login or a admin changing roles
      if (this.navigateURL) {
        console.log(
          `There is a navigateURL ${this.navigateURL}, then we will remove it`,
        );
        this.router.navigate([this.navigateURL]);
        localStorage.setItem('navigateURL', '');
      }
    });
  }
}
