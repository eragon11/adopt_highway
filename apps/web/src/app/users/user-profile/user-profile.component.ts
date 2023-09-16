import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/auth/_models';
import { Router, ActivatedRoute } from '@angular/router';
import { UserProfileService } from '../services/user-profile.service';
import { map } from 'rxjs/internal/operators/map';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UsersAddComponent } from '../users-add/users-add.component';
import { UserDeleteService } from '../services/user-delete.service';
import { UserDeleteDialog } from '../user-delete/user-delete.dialog';
import { RoleType } from 'src/app/auth/_models/role-type';
import { AuthenticationService } from 'src/app/auth/_services';
import { UsersFilterService } from './../services/users-filter.service';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  styles: [
    `
      :host {
        display: flex;
        width: 100vw;
        height: 100vh;
        justify-content: center;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class UserProfileComponent implements OnInit, OnDestroy {
  private subscr: Subscription;
  userId: number = null;
  user: User = null;
  private noRegion: boolean;
  private isDistrictCoordinator: boolean;
  private isMaintenanceCoordinator: boolean;
  private districtName: string;
  private maintOfficeName: string;
  autRoleType: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public profileService: UserProfileService,
    public deleteService: UserDeleteService,
    public dialog: MatDialog,
    public userProfileService: UserProfileService,
    public editUserDialog: MatDialog,
    private authService: AuthenticationService,
    public userFilter: UsersFilterService,
  ) {}

  noAreaRoleTypes = [ RoleType.Administrator, RoleType.ReadOnlyUser, RoleType.Approver, RoleType.Team, RoleType.SignCoordinator ];

  ngOnInit(): void {
    this.autRoleType = this.authService.getSelectedRoleType();
    this.getUserProfile();
  }

  ngOnDestroy() {
    this.subscr.unsubscribe();
  }

  navigateToUserManagement() {
    this.userFilter.clearAllFilters();
    this.router.navigate(['./users/list-users']);
  }

  openEditDialog() {
    const addUserDialogConfig = new MatDialogConfig();

    addUserDialogConfig.disableClose = true;
    addUserDialogConfig.autoFocus = true;

    const dialogRef = this.editUserDialog.open(UsersAddComponent, {
      data: {
        userId: this.userId,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getUserProfile();
    });
  }

  getUserProfile() {
    this.subscr = this.activatedRoute.params.subscribe((params) => {
      this.userId = parseInt(params['id']);
      this.profileService
        .getUserProfile()
        .pipe(map((user: User) => (this.onlyShowAdminRole(user))))
        .subscribe({
          // TODO REFACTOR  - this should be using a common role service
          next: (user) => {
            this.noRegion =
              (this.noAreaRoleTypes.includes(user.roles[0].type)) ? true : false;
            this.isDistrictCoordinator =
              user.roles[0].type === RoleType.District ? true : false;
            this.isMaintenanceCoordinator =
              user.roles[0].type === RoleType.Maintenance ? true : false;
            this.districtName =
              !this.noRegion && this.isDistrictCoordinator
                ? user.roles[0].organization.district.name
                : null;
            this.maintOfficeName =
              !this.noRegion && !this.isDistrictCoordinator
                ? user.roles[0].organization.maintenanceSection.name
                : null;
          },
        });
    });
  }

  onlyShowAdminRole(user: User) {
    if (user.roles.length > 1) {
      // only include the admin as a role when listing
      user.roles.forEach((obj, index, array) => {
        if (obj.type === 'Administrator') {
          user.roles = user.roles.filter(function(el) { return el.type === "Administrator"; });
        }
      });
    }
    return this.user = user;
  }

  softDeleteUser() {
    // Open the delete confirmation dialog
    const dialogRef = this.dialog.open(UserDeleteDialog, {
      data: {
        user: this.user,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      // If the user selected "delete" delete the user
      if (result) {
        this.deleteService.deleteUser().subscribe();
        this.router.navigate(['./users/list-users']);
      }
    });
  }
}
