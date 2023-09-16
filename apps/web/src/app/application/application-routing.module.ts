import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/_helpers';
import { ApplicationDeletedComponent } from './application-deleted/application-deleted.component';
import { ApplicationComponent } from './application.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
  },

  {
    path: 'applicationDeleted',
    component: ApplicationDeletedComponent,
    data: { title: 'Application Deleted' },
  },
  {
    path: ':applicationId',
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    component: ApplicationComponent,
    data: { resourceAction: ['agreements', 'read'] },
  },
  {
    path: ':applicationToken/:accessToken',
    component: ApplicationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
