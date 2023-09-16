import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared-modules/shared-module/shared.module';
import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { UserListComponent } from './user-list/user-list.component';
import { UsersFilterComponent } from './user-filter/users-filter.component';
import { UserListBodyComponent } from './user-list/user-list-body.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserDeleteDialog } from './user-delete/user-delete.dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { UserListHeaderComponent } from './user-list/user-list-header.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { UsersAddComponent } from './users-add/users-add.component';
import { CustomTelInput } from './tel-input/tel-input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserRoleDeleteDialogComponent } from './user-role-delete-dialog/user-role-delete-dialog.component';

@NgModule({
  declarations: [
    UsersComponent,
    UserListComponent,
    UsersFilterComponent,
    UserListHeaderComponent,
    UserListBodyComponent,
    UserProfileComponent,
    UsersAddComponent,
    CustomTelInput,
    UserDeleteDialog,
    UserRoleDeleteDialogComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatPaginatorModule,
    FlexLayoutModule,
    MatDialogModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  bootstrap: [UserDeleteDialog],
})
export class UsersModule {}
