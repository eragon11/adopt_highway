import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RoleType } from 'src/app/auth/_models';
import { Status } from 'src/app/auth/_models/status';
import { District } from 'src/app/common/models/district';
import { MaintOffice } from 'src/app/common/models/maintOffice';
import { AreaDataService } from 'src/app/common/services/area-data.service';
import { UserProfile } from '../models/user-interface';
import { UserDeleteRoleService } from '../services/user-delete-role.service';
import { UsersAddService } from '../services/users-add.service';
import { CustomTel } from '../tel-input/tel-input';
import { UserRoleDeleteDialogComponent } from '../user-role-delete-dialog/user-role-delete-dialog.component';

interface DialogData {
  userId: number;
}

@Component({
  selector: 'app-users-add',
  templateUrl: '../users-add/users-add.component.html',
  styleUrls: ['../users-add/users-add.component.css'],
})
export class UsersAddComponent implements OnInit {
  userForm: FormGroup;
  isEdit = false;
  userId: number;
  user: UserProfile;
  formIsValid = false;
  addedRole = false;

  constructor(
    public dialogRef: MatDialogRef<UsersAddComponent>,
    public areaDataService: AreaDataService,
    public usersAddService: UsersAddService,
    public deleteUserRoleService: UserDeleteRoleService,
    public userRoleDeleteDialog: UserRoleDeleteDialogComponent,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {}

  // Get loading stream from service
  loading$: Observable<boolean> = this.areaDataService.loading$;

  districtsArray: Observable<Array<District>>;
  maintOfficesArray: Observable<Array<MaintOffice>>;

  // get all role types, but remove volunteer as an option
  roleTypes = Object.values(RoleType).filter((role) => {
    return (
      role !== RoleType.Volunteer &&
      role !== RoleType.SignCoordinator &&
      role !== RoleType.Approver &&
      role !== RoleType.Team
    );
  });
  statusTypes = Object.values(Status);

  roleType: string[] = [];

  defaultUserStatus = 'Active';
  isDistrictEmpty = true;
  formValue: string;
  isPhoneValid = false;

  //used to open the selection panels
  @ViewChild('maintOfcTrigger', { read: MatAutocompleteTrigger })
  maintOfcAutocomplete: MatAutocompleteTrigger;

  ngOnInit() {
    // main user form
    this.userForm = this.fb.group({
      firstName: [null],
      lastName: [null],
      email: [null, [Validators.email]],
      contactNumber: [new CustomTel(null, null, null)],
      address1: [null],
      address2: [null],
      city: [null],
      state: [null, [Validators.minLength(2), Validators.maxLength(2)]],
      postalCode: [
        null,
        [
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(5),
          Validators.maxLength(5),
        ],
      ],
      userName: [null, [Validators.required, emailDomain]],
      status: ['Active'],
      roles: this.fb.array([]),
    });

    if (this.data.userId) {
      this.userId = this.data.userId;
      this.isEdit = true;

      this.usersAddService
        .getUserProfile(this.userId)
        .pipe(map((user: UserProfile) => (this.user = user)))
        .subscribe({
          next: () => {
            let phoneDigitsOnly: string;
            let contactNumberControl: CustomTel;
            if (this.user.contactNumber) {
              phoneDigitsOnly = this.user.contactNumber.replace(/\D/g, '');
              if (phoneDigitsOnly.length === 10) {
                this.isPhoneValid = true;
                this.userForm.controls.contactNumber.setValue({
                  area: phoneDigitsOnly.slice(0, 3),
                  exchange: phoneDigitsOnly.slice(3, 6),
                  subscriber: phoneDigitsOnly.slice(6, 10),
                });
              } else {
                contactNumberControl = new CustomTel(null, null, null);
              }
            }

            this.userForm.controls.firstName.setValue(this.user.firstName);
            this.userForm.controls.lastName.setValue(this.user.lastName);
            this.userForm.controls.email.setValue(this.user.email);
            // this.userForm.controls.firstName.setValue(this.user.firstName);
            this.userForm.controls.address1.setValue(this.user.address1);
            this.userForm.controls.address2.setValue(this.user.address2);
            this.userForm.controls.city.setValue(this.user.city);
            this.userForm.controls.state.setValue(this.user.state);
            this.userForm.controls.postalCode.setValue(this.user.postalCode);
            this.userForm.controls.userName.setValue(this.user.userName);
            this.userForm.controls.status.setValue(this.user.status);
            this.user.roles.forEach((incomingRole, i) => {
              // add role formGroup to roles array
              this.addRole(true);
              this.roleType.push(incomingRole.roleType);
              // console.log(incomingRole, i);
              const roles = this.userForm.get('roles') as FormArray;
              const role = roles.at(i) as FormGroup;
              role.get('roleType').patchValue(incomingRole.roleType);
              if (incomingRole.districtNumber) {
                role
                  .get('districtNumber')
                  .patchValue(incomingRole.districtNumber);
                this.districtSelectEvent(
                  incomingRole.districtNumber.toString(),
                  i,
                  false,
                );
              }
              if (incomingRole.officeNumber) {
                role.get('officeNumber').patchValue(incomingRole.officeNumber);
              }
            });
          },
        });
    } else {
      // add role formGroup to roles array
      this.addRole(true);
    }

    // used for testing to display form values
    this.userForm.valueChanges.subscribe(() => {
      this.formValue = JSON.stringify(this.userForm.value);
    });

    // TODO: set email to username - temp fix until we remove duplicate field
    this.userForm.controls.userName.valueChanges.subscribe((val) => {
      this.userForm.controls.email.setValue(val);
    });

    this.userForm.statusChanges.subscribe((status) => {
      this.phoneUpdate();
      if (status === 'VALID' && !this.addedRole && this.isPhoneValid) {
        this.formIsValid = true;
      } else {
        this.formIsValid = false;
      }
      this.addedRole = false;
    });

    this.districtsArray = this.areaDataService.getDistricts();
    this.maintOfficesArray = of([]);
  }

  get roleForms() {
    return this.userForm.get('roles') as FormArray;
  }

  addRole(isInitLoad?: boolean) {
    this.addedRole = true;
    this.formIsValid = false;
    const roleForm: FormGroup = this.fb.group({
      roleType: [null],
      districtNumber: [],
      officeNumber: [],
    });

    this.roleForms.push(roleForm);
    // scroll to bottom
    if (!isInitLoad) {
      setTimeout(() => {
        document.getElementById(
          'roles-card',
        ).scrollTop = document.getElementById('roles-card').scrollHeight;
      }, 5);
    }
  }

  phoneUpdate() {
    if (this.userForm.value.contactNumber) {
      const comboVal = `${this.userForm.value.contactNumber.area}-${this.userForm.value.contactNumber.exchange}-${this.userForm.value.contactNumber.subscriber}`;
      const digitsOnly = comboVal.replace(/\D/g, '');
      if (digitsOnly.length === 10) {
        this.isPhoneValid = true;
      } else {
        this.isPhoneValid = false;
      }
    } else {
      console.log(this.userForm.value);
    }
  }

  keyPressNumberOnly(evt) {
    const charCode = evt.which ? evt.which : evt.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      evt.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  deleteRole(i) {
    if (this.isEdit) {
      // get correct role to delete
      let correctRole: any;
      if (this.roleForms.value[i].roleType === RoleType.District) {
        correctRole = this.user.roles.filter(
          (role) =>
            role.districtNumber === this.roleForms.value[i].districtNumber &&
            role.roleType === this.roleForms.value[i].roleType,
        );
      } else if (this.roleForms.value[i].roleType === RoleType.Maintenance) {
        correctRole = this.user.roles.filter(
          (role) =>
            role.districtNumber === this.roleForms.value[i].districtNumber &&
            role.officeNumber === this.roleForms.value[i].officeNumber &&
            role.roleType === this.roleForms.value[i].roleType,
        );
      } else {
        correctRole = this.user.roles.filter(
          (role) => role.roleType === this.roleForms.value[i].roleType,
        );
      }

      // if an existing role was found...
      if (correctRole.length > 0) {
        const roleId = correctRole[0].id;

        console.log(correctRole);
        // Open the delete user confirmation dialog
        const dialogRef = this.dialog.open(UserRoleDeleteDialogComponent, {
          data: {
            user: this.user,
            roleType: this.roleForms.value[i].roleType,
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          // If the user selected "delete" delete the role
          if (result) {
            this.deleteUserRoleService
              .deleteRole(this.user.id, roleId)
              .subscribe(
                () => {
                  this.roleForms.removeAt(i);
                  this.openSnackBar(
                    `The ${correctRole[0].roleType} role has been removed for ${this.user.firstName} ${this.user.lastName}`,
                    'Success',
                  );
                },
                (error) => {
                  this.openSnackBar(`${error}`, 'Error');
                },
              );
          }
        });
      } else { // no saved role was found.  just remove from client
        this.roleForms.removeAt(i);
      }
    } else {
      this.roleForms.removeAt(i);
    }
  }

  updateRoleType(selRole, i) {
    // scroll to bottom
    setTimeout(() => {
      document.getElementById('roles-card').scrollTop = document.getElementById(
        'roles-card',
      ).scrollHeight;
    }, 5);
    this.roleType[i] = selRole;
    const roles = this.userForm.get('roles') as FormArray;
    const role = roles.at(i) as FormGroup;
    role.get('roleType').patchValue(selRole);

    this.clearRolesControls(i);
    const validSel = this.validRoleSelection(selRole, roles);
    if (!validSel) {
      role.get('roleType').setErrors({ incorrect: !validSel });
      this.openSnackBar(
        'Only District and Maintenance Coordinator roles may be used multiple times',
        'Error',
      );
    }
    if (selRole !== 'Maintenance Coordinator') {
      role.get('districtNumber').setErrors(null);
      role.get('officeNumber').setErrors(null);
    } else if (
      selRole !== 'District Coordinator' &&
      selRole !== 'Maintenance Coordinator'
    ) {
      role.get('officeNumber').setErrors(null);
    }

    this.invalidateNewDcMcInputs(selRole, role);
  }

  validRoleSelection(selRole: string, formRoles: FormArray) {
    // Only DC/MC roles may be used multiple times
    if (
      selRole !== 'District Coordinator' &&
      selRole !== 'Maintenance Coordinator'
    ) {
      let matches = 0;
      formRoles.controls.forEach((role) => {
        if (selRole === role.value.roleType) {
          matches++;
        }
      });
      console.log(selRole, matches);
      if (matches > 1) {
        return false;
      } else return true;
    } else return true;
  }

  invalidateNewDcMcInputs(selRole: string, role: FormGroup) {
    if (selRole === 'District Coordinator') {
      role.get('districtNumber').setErrors({ incorrect: true });
    } else if (selRole === 'Maintenance Coordinator') {
      role.get('districtNumber').setErrors({ incorrect: true });
      role.get('officeNumber').setErrors({ incorrect: true });
    }
  }

  districtSelectEvent(districtNumber: string, i: number, clearOffice: boolean) {
    this.areaDataService.getMaintOffices(districtNumber).subscribe((data) => {
      //need to clear out the inputs for maint office. The selection arrays will be repopulated
      const roles = this.userForm.get('roles') as FormArray;
      const role = roles.at(i) as FormGroup;
      if (clearOffice) {
        role.get('officeNumber').patchValue(null);
        this.clearMaintOfficeControl(i);
      }
      this.isDistrictEmpty = false;
      this.maintOfficesArray = of(data);
    });
  }

  setStatus(status: string) {
    this.userForm.value.status = status;
  }

  onNoClick(): void {
    this.dialogRef.close({ event: 'cancel' });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.roleTypes.filter((role) =>
      role.toLowerCase().includes(filterValue),
    );
  }

  saveUser() {
    if (this.isEdit) {
      // only update changed fields
      const changedFields: any = this.getDirtyValues(this.userForm);
      this.usersAddService.updateUser(
        changedFields,
        this.userId,
        this.dialogRef,
      );
    } else {
      const fields: any = this.userForm.value;
      if (fields.contactNumber) {
        fields.contactNumber = this.formatPhoneInput(fields.contactNumber);
      }
      this.usersAddService.createUser(fields, this.dialogRef);
    }
  }

  private formatPhoneInput(input: any) {
    if (input.area) {
      input = `${input.area}-${input.exchange}-${input.subscriber}`;
      return input;
    }
    return null;
  }

  private getDirtyValues(form: any) {
    const dirtyValues = {};

    Object.keys(form.controls).forEach((key) => {
      const currentControl = form.controls[key];
      if (
        currentControl.dirty &&
        currentControl.value !== '' &&
        key !== 'contactNumber' &&
        key !== 'roles'
      ) {
        if (currentControl.controls) {
          dirtyValues[key] = this.getDirtyValues(currentControl);
        } else {
          dirtyValues[key] = currentControl.value;
          // TODO: remove this once email is removed from the database
          if (key === 'userName') {
            dirtyValues['email'] = currentControl.value;
          }
        }
      }
      // always update all roles
      // else if (key === 'roles') {
      else if (key === 'roles') {
        dirtyValues[key] = currentControl.value;
        console.log(dirtyValues[key], currentControl.value);
      }
      // special case for contactNumber - send raw result -not ContactTel object
      else if (
        key === 'contactNumber' &&
        currentControl.dirty &&
        currentControl.value.area
      ) {
        dirtyValues[key] = this.formatPhoneInput(currentControl.value);
      }
    });
    return dirtyValues;
  }

  private clearDistrictControl(i) {
    this.isDistrictEmpty = true;
    const roles = this.userForm.get('roles') as FormArray;
    const role = roles.at(i) as FormGroup;
    role.get('districtNumber').patchValue(null);
    role.get('officeNumber').patchValue(null);
  }

  private clearMaintOfficeControl(i) {
    const roles = this.userForm.get('roles') as FormArray;
    const role = roles.at(i) as FormGroup;
    role.get('officeNumber').patchValue(null);
  }

  private clearRolesControls(i: number) {
    this.clearDistrictControl(i);
    this.clearMaintOfficeControl(i);
  }

  openSnackBar(message: string, action: string) {
    // const messageArr = cleanMessage.split('.');
    this.snackBar.open(message, action, {
      duration: 6000,
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }

  private convertToFromDistrictName(toName: boolean, val: string) {
    let inputType = 'number';
    let outputType = 'name';
    if (toName) {
      inputType = 'name';
      outputType = 'number';
    }
    // convert dist name to number and set in the formControl
    let district: District;
    this.districtsArray.forEach((districtArray: District[]) => {
      district = districtArray.find((district) => (district[inputType] = val));
    });
    return district[outputType];
  }

  private convertToFromOfficeName(toName: boolean, val: string) {
    let inputType = 'number';
    let outputType = 'name';
    if (toName) {
      inputType = 'name';
      outputType = 'number';
    }
    // convert office name to number and set in the formControl
    let office: MaintOffice;
    this.maintOfficesArray.forEach((officeArray: MaintOffice[]) => {
      office = officeArray.find((office) => (office[inputType] = val));
    });
    return office[outputType];
  }
}

function emailDomain(control: AbstractControl): { [key: string]: any } | null {
  if (control.value) {
    const email: string = control.value;
    const domain = email.substring(email.lastIndexOf('@') + 1);
    if (email === '' || domain.toLowerCase() === 'txdot.gov') {
      return null;
    } else {
      return { emailDomain: true };
    }
  }
}
