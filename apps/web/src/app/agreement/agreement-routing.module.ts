import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/_helpers/auth.guard';
import { ActiveAgreementOverviewComponent } from './active-agreement-overview/active-agreement-overview.component';
import { ActiveAgreementListComponent } from './active-agreement-list/active-agreement-list.component';
import { AgreementComponent } from './agreement.component';

const routes: Routes = [
  {
    path: '',
    component: AgreementComponent,
  },
  {
    path: 'newAgreements',
    component: AgreementComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    data: { resourceAction: ['agreements', 'read'], title: 'New Agreements' },
  },
  {
    path: 'activeAgreements',
    component: ActiveAgreementListComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    data: {
      resourceAction: ['agreements', 'read'],
      title: 'Active Agreements',
    },
  },
  {
    path: 'activeAgreements/:agreementId',
    component: ActiveAgreementOverviewComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    data: { resourceAction: ['agreements', 'read'], title: 'Active Agreement' },
  },
  {
    path: 'agreements',
    component: AgreementComponent,
  },
  {
    path: '/application/',
    loadChildren: () =>
      import('src/app/application/application.module').then(
        (m) => m.ApplicationModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgreementRoutingModule {}
