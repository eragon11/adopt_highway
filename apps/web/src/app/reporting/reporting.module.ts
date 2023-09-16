import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingComponent } from './reporting.component';
import { HeaderComponent } from './pageComponents/header/header.component';
import { ReportIconsComponent } from './report-icons/report-icons.component';
import { ReportTableComponent } from './report-section/report-table.component';
import { ReportSectionComponent } from './report-section/report-section.component';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../shared-modules/shared-module/shared.module';
import { AgreementReportComponent } from './reports/agreement-report.component';
import { RptDirective } from './report-section/rpt.directive';
import { DefaultReportComponent } from './reports/default-report.component';
import { PickupReportComponent } from './reports/pickup-report.component';
import { MatSortModule } from '@angular/material/sort';
import { OverlayModule } from '@angular/cdk/overlay';
import { SegmentReportComponent } from './reports/segment-report.component';
import { DataPropertyGetterPipe } from './report-section/data-property-getter.pipe';
import { AreaFilterComponent } from './pageComponents/header/area-filter.component';
import { SignReportComponent } from './reports/sign-report.component';
import { AgreementsByRenewalReportComponent } from './reports/agreements-by-renewal-report.component';
import { GroupReportComponent } from './reports/group-report.component';
import { GroupTypeInfoReportComponent } from './reports/group-type-info-report.component';

@NgModule({
  declarations: [
    ReportingComponent,
    HeaderComponent,
    ReportIconsComponent,
    ReportIconsComponent,
    ReportSectionComponent,
    ReportTableComponent,
    AgreementReportComponent,
    RptDirective,
    DataPropertyGetterPipe,
    DefaultReportComponent,
    PickupReportComponent,
    SegmentReportComponent,
    AreaFilterComponent,
    SignReportComponent,
    GroupReportComponent,
    AgreementsByRenewalReportComponent,
    GroupTypeInfoReportComponent,
  ],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatTableExporterModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    OverlayModule,
    SharedModule,
  ]
})
export class ReportingModule {}
