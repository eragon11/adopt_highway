import { NgModule } from '@angular/core';
import { AgreementRoutingModule } from './agreement-routing.module';
import { AgreementComponent } from './agreement.component';
import { SharedModule } from '../shared-modules/shared-module/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AgreementFilterComponent } from './agreement-filter/agreement-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ActiveAgreementListComponent } from './active-agreement-list/active-agreement-list.component';
import { ActiveAgreementOverviewComponent } from './active-agreement-overview/active-agreement-overview.component';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PickupsComponent } from './pickups/pickups.component';
import { AddPickupComponent } from './add-pickup/add-pickup.component';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { DeletePickupDialogComponent } from './delete-pickup-dialog/delete-pickup-dialog.component';
import {MatSortModule} from '@angular/material/sort';

@NgModule({
  imports: [
    AgreementRoutingModule,
    SharedModule,
    MatTableModule,
    MatNativeDateModule,
    CommonModule,
    MatTooltipModule,
    MatIconModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatCardModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatSortModule,
  ],

  declarations: [
    AgreementComponent,
    AgreementFilterComponent,
    ActiveAgreementListComponent,
    ActiveAgreementOverviewComponent,
    PickupsComponent,
    AddPickupComponent,
    DeletePickupDialogComponent,
  ],
})
export class AgreementModule {}
