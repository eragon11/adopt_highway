import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/_helpers/auth.guard';
import { TxdotAahMapComponent } from './txdot-aah-map/txdot-aah-map.component';
import { LoginComponent } from './login/login.component';
import { SamlComponent } from './login/saml/saml.component';
import { LogoutComponent } from './logout/logout.component';
import { NotLoggedInComponent } from './not-logged-in/not-logged-in.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { VolunteerComponent } from './volunteer/volunteer.component';
import { VolunteerGuard } from './volunteer.guard';
import { SamlExternalComponent } from './login/saml/external-saml.component';
import { ServerErrorComponent } from './server-error/server-error.component';

const routes: Routes = [
  {
    path: 'volunteer',
    component: VolunteerComponent,
    canActivate: [VolunteerGuard],
    data: {
      title: 'Volunteer',
    },
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
    data: {
      title: 'Access Denied',
    },
  },
  {
    path: 'server-error',
    component: ServerErrorComponent,
    data: {
      title: 'Server Error',
    },
  },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Your session has ended',
    },
  },
  {
    path: 'notloggedin',
    component: NotLoggedInComponent,
    data: {
      title: 'You are not logged in',
    },
  },
  {
    path: 'agreements',
    loadChildren: () =>
      import('src/app/agreement/agreement.module').then(
        (m) => m.AgreementModule,
      ),
    data: {
      title: 'Agreements',
    },
  },
  {
    path: 'report',
    loadChildren: () =>
      import('src/app/reporting/reporting.module').then(
        (m) => m.ReportingModule,
      ),
    data: {
      title: 'Reports',
    },
  },
  {
    path: 'map',
    component: TxdotAahMapComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    data: { resourceAction: ['map', 'update'], title: 'Adopt A Highway Map' },
  },
  {
    path: 'auth/ext-login',
    component: SamlExternalComponent,
    data: {
      title: 'Access Denied',
    },
  },
  {
    path: 'auth/login',
    component: SamlComponent,
    data: {
      title: 'Log In',
    },
  },
  {
    path: 'selectrole',
    component: LoginComponent,
    data: {
      title: 'Select Role',
    },
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
    data: {
      title: 'User Management',
    },
  },
  {
    path: 'application',
    loadChildren: () =>
      import('./application/application.module').then(
        (m) => m.ApplicationModule,
      ),
    data: {
      title: 'New Application for Adopt a Highway',
    },
  },
  {
    path: '**',
    redirectTo: 'map',
    data: {
      title: 'Access Denied',
    },
  },
];

@NgModule({
  declarations: [ServerErrorComponent],
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
