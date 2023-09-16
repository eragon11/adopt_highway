import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { environment } from './../../environments/environment';
import { User } from '../auth/_models';
import { AuthenticationService } from '../auth/_services';
import { Router } from '@angular/router';
import { SidenavService } from 'src/app/sidenav/sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  public user: User;
  public currentRole;
  public env = environment;
  public showAgreements = true;
  public aahVersion;
  public showAgreementsSubMenu = false;

  constructor(
    public authService: AuthenticationService,
    private router: Router,
    private sidenav: SidenavService,
  ) {
    this.aahVersion = environment.aahVersion;
  }

  ngOnInit(): void {
    this.authService.getUserValue().subscribe((data) => {
      if (data) {
        this.user = data;
        this.currentRole = this.authService.getSelectedRoleTypeFull();
      }
    });
  }

  sidebarNavMenuClicked(event: Event): void {
    this.sidenav.closeSideNav();
  }

  agreementMainMenuClicked(): void {
    this.showAgreementsSubMenu = !this.showAgreementsSubMenu;
  }

  logout(): void {
    this.sidenav.closeSideNav();
    this.authService.logout();
  }
}
