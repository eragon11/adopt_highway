import { Component, Inject, ViewChild } from '@angular/core';
import { environment } from './../environments/environment';
import { TxdotAahMapviewService } from './txdot-aah-map/txdot-aah-mapview.service';
import { SidenavService } from './sidenav/sidenav.service';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthenticationService } from './auth/_services/authentication.service';
import {
  ActivatedRoute,
  NavigationEnd,
  NavigationStart,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { filter, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TxdotAahMapviewService, SidenavService],
})
export class AppComponent {
  @ViewChild('sidenav') public sidenav: MatSidenav;

  //expose the environment const to the template
  env = environment;
  checkTokenExpiredInterval = null;
  bannerHeight = '100px';
  navigationSubs = new Subscription();
  constructor(
    public sideNavService: SidenavService,
    private authService: AuthenticationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private titleService: Title,
  ) {
    this.navigationSubs = this.router.events.subscribe((event: any) => {
      if (
        event instanceof NavigationStart &&
        !localStorage.getItem('navigateURL') &&
        event.url &&
        event.url.length > 1 &&
        !['/login', '/selectrole'].includes(event.url)
      ) {
        localStorage.setItem('navigateURL', event.url);
      }
      this.navigationSubs.unsubscribe();
    });
    authService.userSubject$.subscribe((user) => {
      if (user) {
        clearInterval(this.checkTokenExpiredInterval);
        this.checkTokenExpiredInterval = setInterval(() => {
          this.authService.isAuthenticated().subscribe((authenticated) => {
            if (!authenticated) {
              clearInterval(this.checkTokenExpiredInterval);
              location.href = '/login';
            }
          });
        }, environment.checkTokenExpiredTimeoutInMinutes * 60 * 1000);
      }
    });
  }
  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          let routeTitle = '';
          while (route!.firstChild) {
            route = route.firstChild;
          }
          if (route.snapshot.data['title']) {
            routeTitle = route!.snapshot.data['title'];
          }
          return routeTitle;
        }),
      )
      .subscribe((title: string) => {
        if (title) {
          this.titleService.setTitle(title);
        }
      });

    const snackBar = this.snackBar.openFromComponent(ConsentMessage, {
      panelClass: 'warning-banner',
      data: {
        preClose: () => {
          snackBar.dismiss();
        },
      },
    });
    this.sideNavService.sideNavToggleSubject.subscribe((state) => {
      console.log(`in sidenav subscription with state: ${state}`);
      if (this.sidenav) {
        switch (state) {
          case 'close': {
            this.sidenav.close();
            break;
          }
          case 'open': {
            this.sidenav.open();
            break;
          }
          default: {
            this.sidenav.toggle();
            break;
          }
        }
      }
    });
    const currentEnv = this.env.nodeEnv;
    if (!['prod', 'production', 'pre-prod', 'preprod'].includes(currentEnv)) {
      this.bannerHeight = '125px';
    }
  }
}

@Component({
  selector: 'app-consent-message-snackbar',
  template: `
    <div class="consent-close-container">
      <button mat-button (click)="dismiss()">X</button>
    </div>
    <div class="message-container">
      You are accessing a TxDOT system. System usage may be monitored, recorded,
      and subject to audit. Unauthorized use of the system is prohibited and
      subject to criminal and civil penalties. Acknowledging this message
      indicates that you consent to monitoring and recording.
    </div>
  `,
})
export class ConsentMessage {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data) {}

  dismiss() {
    this.data.preClose();
  }
}
