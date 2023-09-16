import { NgModule } from '@angular/core';
import { DialogComponent } from './dialog/dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { ApplicationRoutingModule } from './application-routing.module';
import {
  ApplicationComponent,
  DeleteApplicationDialog,
} from './application.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApplicationDeletedComponent } from './application-deleted/application-deleted.component';
import { SharedModule } from '../shared-modules/shared-module/shared.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RejectApplicationDialogComponent } from './reject-application-dialog/reject-application-dialog.component';
import { ApproveApplicationDialogComponent } from './approve-application-dialog/approve-application-dialog.component';
import { ApplicationRequestDialogComponent } from './application-request-dialog/application-request-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ApplicationSignDialogComponent } from './application-sign-dialog/application-sign-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomTelInput } from './tel-input/tel-input';

@NgModule({
  imports: [
    MatIconModule,
    ApplicationRoutingModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    FlexLayoutModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    SharedModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: [
    DialogComponent,
    ApplicationComponent,
    ApplicationDeletedComponent,
    DeleteApplicationDialog,
    RejectApplicationDialogComponent,
    ApproveApplicationDialogComponent,
    ApplicationRequestDialogComponent,
    ApplicationSignDialogComponent,
    CustomTelInput,
  ],
  entryComponents: [DialogComponent, DeleteApplicationDialog],
  providers: [MatDatepickerModule],
})
export class ApplicationModule {}
