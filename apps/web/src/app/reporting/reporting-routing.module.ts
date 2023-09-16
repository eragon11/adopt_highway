import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportingComponent } from './reporting.component';
import { AuthGuard } from 'src/app/auth/_helpers/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ReportingComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    data: { resourceAction: ['reports', 'read'] },
    children: [
      {
        path: 'agreement',
        component: ReportingComponent,
        data: { title: 'Reports - Agreements' },
      },
      {
        path: 'pickup',
        component: ReportingComponent,
        data: { title: 'Reports - Pickups' },
      },
      {
        path: 'segment',
        component: ReportingComponent,
        data: { title: 'Reports - Segments' },
      },
      {
        path: 'sign',
        component: ReportingComponent,
        data: { title: 'Reports - Signs' },
      },
      {
        path: 'agreements-by-renewal-date',
        component: ReportingComponent,
        data: { title: 'Reports - Agreements by Renewal Date' },
      },
      {
        path: 'group-type-info',
        component: ReportingComponent,
        data: { title: 'Agreements - Group Type Summary' },
      },
      {
        path: 'group',
        component: ReportingComponent,
        data: { title: 'Agreements - Groups' },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportingRoutingModule {}
