import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/_helpers';
import { UserListComponent } from 'src/app/users/user-list/user-list.component';
import { UsersComponent } from './users.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersAddComponent } from './users-add/users-add.component';
// import { AuthGuard } from 'src/app/auth/_helpers/auth.guard';

const routesOG: Routes = [{ path: '', component: UsersComponent }];

const routes: Routes = [
  //we dont want to show the UsersComponent because it only serves as the framework for user management
  //therefore the default page will be the the list-user page
  {
    path: '',
    redirectTo: 'list-users',
  },
  {
    path: '',
    component: UsersComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    data: { resourceAction: ['users', 'read'] },
    children: [
      {
        path: 'list-users',
        component: UserListComponent,
        data: { title: 'List Users' },
      },
      {
        path: ':id',
        component: UserProfileComponent,
        data: { title: 'User Info' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
