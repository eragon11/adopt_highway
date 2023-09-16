import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TxdotAahMapComponent } from './txdot-aah-map/txdot-aah-map.component';
import {
  HttpClientModule,
  HttpClientXsrfModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
// import { HttpErrorHandler } from './http-error-handler.service';
import { MessageService } from './message.service';
import { TxdotBannerComponent } from './txdot-banner/txdot-banner.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ErrorInterceptor } from './auth/_helpers';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewApplicationsAgreementsComponent } from './dashboard/widgets/new-applications-agreements/new-applications-agreements.component';
import { AgreementsByStatusComponent } from './dashboard/widgets/agreements-by-status/agreements-by-status.component';
import { ChartsModule } from 'ng2-charts';
import { RenewableAgreementsComponent } from './dashboard/widgets/renewable-agreements/renewable-agreements.component';
import { SignStatusesComponent } from './dashboard/widgets/sign-statuses/sign-statuses.component';
import { AgreementRenewalsComponent } from './dashboard/widgets/agreement-renewals/agreement-renewals.component';
import { SegmentsByStatusComponent } from './dashboard/widgets/segments-by-status/segments-by-status.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { NewAgreementsSignedComponent } from './dashboard/widgets/new-agreements-signed/new-agreements-signed.component';
import { SamlComponent } from './login/saml/saml.component';
import { RoleselectorComponent } from './login/roleselector/roleselector.component';
import { NotLoggedInComponent } from './not-logged-in/not-logged-in.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'src/app/shared-modules/shared-module/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { A11yModule } from '@angular/cdk/a11y';
import { CustomTelInput } from './common/tel-input-old/tel-input';
import { RefreshTokenInterceptor } from './auth/_interceptors/refresh-token.interceptor';
import { AuthenticationService } from './auth/_services';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CsrfCookieInterceptor } from './csrf/csrf.interceptor';
import { VolunteerComponent } from './volunteer/volunteer.component';
import { WithCredentialsInterceptor } from './auth/_interceptors/with-credentials.interceptor';
import { SpinnerComponent } from './common/components/spinner/spinner.component';

@Injectable()
export class AAHErrorHandler implements ErrorHandler {
  handleError(error) {
    console.error('Error Received: ' + error);

    throw error;
  }
}
@NgModule({
  exports: [A11yModule],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
    ReactiveFormsModule,
    AppRoutingModule,
    ChartsModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    SharedModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatListModule,
    FormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatRadioModule,
    MatInputModule,
    MatSelectModule,
    A11yModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatToolbarModule,
  ],
  declarations: [
    AppComponent,
    TxdotAahMapComponent,
    TxdotBannerComponent,
    PageNotFoundComponent,
    DashboardComponent,
    LoginComponent,
    NewApplicationsAgreementsComponent,
    AgreementsByStatusComponent,
    RenewableAgreementsComponent,
    SignStatusesComponent,
    AgreementRenewalsComponent,
    SegmentsByStatusComponent,
    SidenavComponent,
    NewAgreementsSignedComponent,
    SamlComponent,
    RoleselectorComponent,
    NotLoggedInComponent,
    VolunteerComponent,
    CustomTelInput,
    SpinnerComponent,
  ],
  providers: [
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WithCredentialsInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true,
      deps: [AuthenticationService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CsrfCookieInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
