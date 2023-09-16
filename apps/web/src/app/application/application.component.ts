import { AuthenticationService } from 'src/app/auth/_services/authentication.service';
import { Component, Inject, OnInit, SimpleChanges } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ApplicationsService } from '../services/applications.service';
import { CountiesService, County } from '../services/counties.service';
import { DialogService } from '../services/dialog.service';
import { FormHelperService } from '../helpers/form-helper.service';
import { ApplicationService } from './services/application.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { PermissionsService } from '../auth/_services/permissions.service';
import { Application } from '../models/application.model';
import { Observable } from 'rxjs';
import { RoleType, User } from '../auth/_models';
import { ApplicationStatus } from '.';
import { ApproveApplicationDialogComponent } from './approve-application-dialog/approve-application-dialog.component';
import { RejectApplicationDialogComponent } from './reject-application-dialog/reject-application-dialog.component';
import { ApplicationRequestDialogComponent } from './application-request-dialog/application-request-dialog.component';
import { map, startWith } from 'rxjs/operators';
import { ApplicationSignDialogComponent } from './application-sign-dialog/application-sign-dialog.component';
import { DistrictCoordinatorsService } from './services/district-coordinators.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { formatDate } from '@angular/common';
import { CustomTel } from './tel-input/tel-input';
import { LoaderService } from '../common/services/loader.service';
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css'],
  providers: [ApplicationService],
})
export class ApplicationComponent implements OnInit {
  applicationForm: FormGroup;
  counties: County[] = [];
  groupTypes = this.applicationService.groupTypes;
  isConfirmPrimaryEmailInvalid = false;
  isConfirmSchoolEmailInvalid = false;
  isConfirmSecondaryEmailInvalid = false;
  isAnonymousUser = false;
  applicationId = null;
  applicationToken = null;
  accessToken = null;
  groupName = '';
  showSubmit = false;
  showUpdate = false;
  showConfirm = false;
  showSegment = false;
  showDelete = false;
  applicationStatus = '';
  awaitingSignApproval = 'Awaiting sign approval';
  showRequest = false;
  appData: any;
  currentRole = '';
  dcName: string;
  groupCounties: Observable<County[]>;
  authorizedCounties: Observable<County[]>;
  alternateCounties: Observable<County[]>;
  roadWayCounties: Observable<County[]>;
  districtCoordinators: any[];
  maxLineLength = 11;
  statuses = ApplicationStatus;
  roles = RoleType;
  showAgreementDetails = false;
  isPhoneValid = false;
  phoneNumberControlsArr: string[] = [
    'primaryContactPhoneNumber',
    'secondaryContactPhoneNumber',
    'schoolPhoneNumber',
  ];

  constructor(
    private applicationService: ApplicationService,
    private authService: AuthenticationService,
    private countiesService: CountiesService,
    private dialogservice: DialogService,
    private formHelperService: FormHelperService,
    private applicationsService: ApplicationsService,
    private permissions: PermissionsService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    public dialog: MatDialog,
    public router: Router,
    public districtCoordinatorsService: DistrictCoordinatorsService,
    private loadingService: LoaderService,
  ) {}

  ngOnInit(): void {
    // force CSRF token call
    this.http
      .get(`${environment.apiUrl}/`, {
        withCredentials: true,
      })
      .subscribe(() => null);

    // check if user is authenticated
    this.isAnonymousUser = !this.isUserAuthenticated();

    // assign params for ID or tokens
    const params = this.route.snapshot.params;
    this.applicationId = params?.applicationId;
    this.applicationToken = params?.applicationToken;
    this.accessToken = params?.accessToken;

    this.applicationForm = this.applicationService.createApplicationForm();

    if (this.isAnonymousUser) {
      this.disableAgreementDetails();
    }

    // get counties
    this.countiesService.getAllCountiesNames().subscribe((resp) => {
      this.counties = resp;
      this.groupCounties = this.applicationForm.controls.groupCountyNumber.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || '')),
      );

      this.authorizedCounties = this.applicationForm.controls.primaryContactCountyNumber.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || '')),
      );
      this.alternateCounties = this.applicationForm.controls.secondaryContactCountyNumber.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || '')),
      );
      this.roadWayCounties = this.applicationForm.controls.requestedHighwayCountyNumber.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || '')),
      );
    });

    if (this.applicationId || (this.applicationToken && this.accessToken)) {
      this.loadingService.setLoading(true);
      this.loadApplicationData(params);
    } else {
      this.showSubmit = true;
    }

    this.bindApplicationFormEvents();
  }

  private _filter(value: string): County[] {
    const filterValue = isNaN(Number(value))
      ? value.toLowerCase()
      : this.fetchCountyName(Number(value));

    return this.counties.filter((option) =>
      option.name.toLowerCase().includes(filterValue),
    );
  }

  fetchCountyName(countyNumber: number) {
    let countyName = '';
    this.counties.forEach((county) => {
      if (countyNumber === Number(county.number)) {
        countyName = county.name;
      }
    });
    return countyName;
  }

  fetchCountyNumber(countyName: string) {
    let countyNumber;
    this.counties.forEach((county) => {
      if (countyName.toLowerCase() === county.name.toLowerCase()) {
        countyNumber = county.number;
      }
    });
    return countyNumber;
  }

  bindApplicationFormEvents() {
    this.applicationForm.controls.isSchool.valueChanges.subscribe((value) => {
      if (value) {
        this.applicationForm.controls.schoolName.enable();
        this.applicationForm.controls.schoolPhoneNumber.enable();
        this.applicationForm.controls.schoolEmail.enable();
        this.applicationForm.controls.schoolConfirmEmail.enable();
      } else {
        this.applicationForm.controls.schoolName.disable();
        this.applicationForm.controls.schoolPhoneNumber.disable();
        this.applicationForm.controls.schoolEmail.disable();
        this.applicationForm.controls.schoolConfirmEmail.disable();
      }
    });

    this.applicationForm.controls.isSchool.setValue(
      this.applicationForm.controls.isSchool.value,
    );
  }

  setConfirmEmailsValues() {
    this.applicationForm.controls.schoolConfirmEmail.setValue(
      this.applicationForm.controls.schoolEmail.value || '',
    );

    this.applicationForm.controls.primaryContactConfirmEmail.setValue(
      this.applicationForm.controls.primaryContactEmail.value || '',
    );

    this.applicationForm.controls.secondaryContactConfirmEmail.setValue(
      this.applicationForm.controls.secondaryContactEmail.value || '',
    );
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges called.....');
    console.log(changes);
  }

  onFocusSignBoxInput(
    signBoxHint: HTMLElement,
    currentInput: HTMLInputElement,
  ) {
    // signBoxHint.style.display = 'block';
    currentInput.setAttribute('previousVal', currentInput.value);

    this.validateSign(false, true);
  }

  onBlurSignBoxInput(signBoxHint: HTMLElement) {
    // signBoxHint.style.display = 'none';

    this.validateSign(false, true);
  }

  onInputSignBoxHint(
    currentInput: HTMLInputElement,
    nextInput: HTMLInputElement,
    controlName: string,
  ) {
    const pattern = /^[a-zA-Z0-9'& -]{0,13}$/;
    const valid = pattern.test(currentInput.value);
    if (valid) {
      this.applicationForm.controls[controlName].setValue(
        currentInput.value.toUpperCase(),
      );
      currentInput.setAttribute('previousVal', currentInput.value);
    } else {
      currentInput.value = currentInput.getAttribute('previousVal');
    }

    // recalc max line length
    if (controlName === 'signLine_4') {
      if (this.applicationForm.controls.signLine_4.value.trim().length > 0) {
        this.maxLineLength = 13;
      } else {
        this.maxLineLength = 11;
      }
    }
    this.validateSign(false, true);
  }

  spaceValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        const spaces = control.value.trim().split(' ').length - 1;
        if (spaces < 3) {
          return null;
        } else {
          return { spaces: true };
        }
      } else {
        return null;
      }
    };
  }

  lineValidation(controlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (
        // if line 2 is empty and 3 or 4 are not...
        controlName === 'signLine_2' &&
        control.value === '' &&
        (this.applicationForm.controls.signLine_3.value !== '' ||
          this.applicationForm.controls.signLine_4.value !== '')
      ) {
        return { empty: true };
      } else if (
        // if line 3 is empty and 4 is not...
        controlName === 'signLine_3' &&
        control.value === '' &&
        this.applicationForm.controls.signLine_4.value !== ''
      ) {
        return { empty: true };
      } else {
        return null;
      }
    };
  }

  checkForBadValue(currentVal: string) {
    const pattern = /^[a-zA-Z0-9'& -]{0,13}$/;
    const valid = pattern.test(currentVal);
    console.log(valid);
    const spaces = currentVal.trim().split(' ').length - 1;
    if (spaces < 3) {
      return valid;
    } else {
      return false;
    }
  }

  showInvalidCountyError(errorMessage: string) {
    this.snackBar.open(errorMessage, 'Dismiss', {
      duration: 6000,
      verticalPosition: 'top',
      panelClass: 'custom-snackbar',
    });
  }

  onClickSubmitForm() {
    console.log(this.applicationForm.value);
    if (this.applicationForm.valid) {
      let formData = this.applicationForm.value;
      const isCountiesValid = this.clearConfirmEmailandValidateCounties(
        formData,
      );
      if (isCountiesValid) {
        return;
      }
      if (this.showAgreementDetails) {
        formData = this.updateDateFormats(formData);
        formData = this.updatetxdotContact(formData);
      }
      formData = this.formatPhoneInput(formData);

      this.loadingService.setLoading(true);
      this.applicationsService.saveApplication(formData).subscribe(
        () => {
          this.loadingService.setLoading(false);
          const primaryEmail = this.applicationForm.controls.primaryContactEmail
            .value;
          this.resetApplicationForm();
          this.dialogservice.openDialog({
            message: `Congratulations, your application for Adopt-a-Highway has been successfully submitted. A confirmation email has been sent to ${primaryEmail}. Please check your email to confirm your application within the next 24 hours. If your application is not confirmed, you will need to submit a new application.`,
            btnOk: 'Ok',
          });
        },
        (error) => {
          this.loadingService.setLoading(false);
          this.handleError(error);
        },
      );
    } else {
      this.formHelperService.validateForm(this.applicationForm);
    }
  }

  isFormInvalid() {
    return !this.applicationForm.valid;
  }

  clearConfirmEmailandValidateCounties(formData) {
    const confirmEmailKeys = [
      'primaryContactConfirmEmail',
      'secondaryContactConfirmEmail',
      'schoolConfirmEmail',
    ];

    const countyNumberKeys = [
      'requestedHighwayCountyNumber',
      'secondaryContactCountyNumber',
      'primaryContactCountyNumber',
      'groupCountyNumber',
    ];
    let countyErrorMessage = '';
    Object.keys(formData).forEach((key) => {
      if (formData[key] === '' && confirmEmailKeys.indexOf(key) > -1) {
        delete formData[key];
      }
      if (formData[key] === '' && countyNumberKeys.indexOf(key) > -1) {
        if (isNaN(formData[key])) {
          const countyNumber = this.fetchCountyNumber(
            this.applicationForm.controls[key].value,
          );

          if (countyNumber) {
            this.applicationForm.controls[key].setValue(countyNumber);
          } else {
            if (key === 'groupCountyNumber') {
              countyErrorMessage =
                'Please enter a valid County name for Group.';
            } else if (key === 'secondaryContactCountyNumber') {
              countyErrorMessage =
                'Please enter a valid County name for Secondary Contact.';
            } else if (key === 'primaryContactCountyNumber') {
              countyErrorMessage =
                'Please enter a valid County name for Primary Contact.';
            } else if (key === 'requestedHighwayCountyNumber') {
              countyErrorMessage =
                'Please enter a valid County name for Requested Highway.';
            }
            this.showInvalidCountyError(countyErrorMessage);
          }
        }
      }
    });
    return countyErrorMessage;
  }

  setDistrictCoordinators() {
    this.districtCoordinatorsService
      .getDistrictCoordinators(this.applicationForm.controls.aahSegmentId.value)
      .subscribe((resp) => {
        this.districtCoordinators = resp;
        this.dcName = this.getDcName(this.appData.txdotContactUserId);
      });
  }

  onUpdateClick() {
    console.log(this.applicationForm.value);
    if (this.applicationForm.valid) {
      let formData = this.applicationForm.value;
      const isCountiesValid = this.clearConfirmEmailandValidateCounties(
        formData,
      );
      if (isCountiesValid) {
        return;
      }
      if (this.showAgreementDetails) {
        formData = this.updateDateFormats(formData);
        formData = this.updatetxdotContact(formData);
      }
      formData = this.formatPhoneInput(formData);
      this.loadingService.setLoading(true);
      if (this.applicationId) {
        this.onApplicationUpdateClick(formData);
      } else {
        this.OnApplicationUpateByTokens(formData);
      }
    } else {
      this.applicationForm.markAllAsTouched();
      this.formHelperService.validateForm(this.applicationForm);
    }
  }

  onApplicationUpdateClick(formData) {
    console.log(formData);
    this.applicationsService
      .updateApplication(formData, this.applicationId)
      .subscribe(
        () => {
          this.loadingService.setLoading(false);
          this.displayUpdateSuccess();
          this.applicationForm.markAsPristine();
        },
        (error) => {
          this.loadingService.setLoading(false);
          this.handleError(error);
        },
        () => {
          this.loadingService.setLoading(false);
          this.loadApplicationData({ applicationId: this.applicationId });
        },
      );
  }

  OnApplicationUpateByTokens(formData) {
    this.applicationsService
      .updateApplicationByTokens(
        formData,
        this.applicationToken,
        this.accessToken,
      )
      .subscribe(
        () => {
          this.loadingService.setLoading(false);
          this.displayUpdateSuccess();
        },
        (error) => {
          this.loadingService.setLoading(false);
          this.handleError(error);
        },
      );
  }

  displayUpdateSuccess() {
    this.snackBar.open(
      `The ${this.appData.groupName} application was updated successfully.`,
      'Dismiss',
      {
        duration: 6000,
        verticalPosition: 'top',
        panelClass: 'custom-snackbar',
      },
    );
  }

  displayConfirmSuccess() {
    this.snackBar.open(
      `The ${this.appData.groupName} application was confirmed successfully.`,
      'Dismiss',
      {
        duration: 6000,
        verticalPosition: 'top',
        panelClass: 'custom-snackbar',
      },
    );
  }

  handleError(error) {
    const errors = (error?.message || '').split(':');
    const messages = (errors[1] || '').split(',');
    let content = '';

    if ((errors[0] || '').indexOf('500') > -1) {
      this.snackBar.open(
        `The ${this.applicationForm.controls.groupName.value} application could not be saved because of a server error, try to save the application again later`,
        'Dismiss',
        {
          duration: 6000,
          verticalPosition: 'top',
          panelClass: 'custom-snackbar',
        },
      );
    } else {
      if (messages?.length) {
        content = '<ul>';
        messages.forEach((msg) => {
          content += '<li>' + msg.trim() + '</li>';
        });
        content += '</ul>';
      }

      this.dialogservice.openDialog({
        message: `The ${this.applicationForm.controls.groupName.value} application was not saved successfully. Please correct any errors and try again.`,
        content: content,
        btnOk: 'Ok',
      });
    }
  }

  onClickResetForm() {
    if ((this.applicationToken && this.accessToken) || this.applicationId) {
      this.openDeleteDialog();
    } else {
      const dialogRef = this.dialogservice.openDialog({
        message:
          'Are you sure that you want to clear all inputs and reset this form? This cannot be undone',
        btnOk: 'Ok',
      });

      dialogRef.afterClosed().subscribe((value) => {
        if (value) {
          this.resetApplicationForm();
        }
      });
    }
  }

  openDeleteDialog() {
    if ((this.applicationToken && this.accessToken) || this.applicationId) {
      let applicationDetails;
      if (this.applicationToken) {
        applicationDetails = {
          groupName: this.groupName,
          applicationToken: this.applicationToken,
          accessToken: this.accessToken,
          approvers: 'approvers',
        };
      } else if (this.applicationId) {
        applicationDetails = {
          groupName: this.groupName,
          applicationId: this.applicationId,
        };
      }

      const deleteDialogRef = this.dialog.open(DeleteApplicationDialog, {
        data: applicationDetails,
      });

      deleteDialogRef.afterClosed().subscribe((result) => {
        if (result === 'delete') {
          if (this.accessToken) {
            this.router.navigateByUrl('application/applicationDeleted');
          } else if (this.applicationId) {
            this.backToAgreements();
          }
        }
      });
    }
  }

  openRequestDialog() {
    let segmentDetails;
    if (this.applicationId) {
      segmentDetails = {
        applicationId: this.applicationId,
      };
    } else {
      segmentDetails = {
        applicationId: this.applicationId,
        applicationToken: this.applicationToken,
        accessToken: this.accessToken,
      };
    }

    const requestDialogRef = this.dialog.open(
      ApplicationRequestDialogComponent,
      {
        data: segmentDetails,
      },
    );

    requestDialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result === 'Send Request') {
        this.showRequest = false;
      }
    });
  }

  openSignDialog() {
    if (this.applicationId && this.appData.groupName) {
      const signData = {
        applicationId: this.applicationId,
        groupName: this.appData.groupName,
      };
      const signDialogRef = this.dialog.open(ApplicationSignDialogComponent, {
        data: signData,
      });

      signDialogRef.afterClosed().subscribe((result) => {
        console.log(result);
        if (result === 'Send Request') {
          this.showRequest = false;
        }
      });
    } else {
    }
  }

  resetApplicationForm() {
    this.applicationForm.controls.groupWebsiteUrl.setValue(
      'https://www.test.com',
    );
    this.applicationForm.reset();
    this.applicationForm.controls.isSchool.setValue(false);
  }

  compareEmail(email, confirmEmail): boolean {
    let isInvalid = false;
    const primaryEmail = this.applicationForm.controls[email].value;
    const confrmEmail = this.applicationForm.controls[confirmEmail].value;
    if (
      !this.applicationForm.controls[confirmEmail].errors?.required &&
      !this.applicationForm.controls[confirmEmail].errors?.email
    ) {
      if (confirmEmail && primaryEmail != confrmEmail) {
        isInvalid = true;
        this.applicationForm.controls[confirmEmail].setErrors({
          incorrect: true,
        });
      } else {
        isInvalid = false;
        this.applicationForm.controls[confirmEmail].setErrors(null);
      }
    }
    return isInvalid;
  }

  confirmApp() {
    if (this.showConfirm && this.isAnonymousUser) {
      let formData = this.applicationForm.value;
      if (this.showAgreementDetails) {
        formData = this.updateDateFormats(formData);
        formData = this.updatetxdotContact(formData);
      }
      formData = this.formatPhoneInput(formData);
      this.loadingService.setLoading(true);
      this.applicationsService
        .confirmApplicationByToken(
          formData,
          this.applicationToken,
          this.accessToken,
        )
        .subscribe({
          complete: () => {
            this.loadingService.setLoading(false);
            this.showConfirm = false;
            this.showUpdate = false;
            this.displayConfirmSuccess();
          },
          error: (error) => {
            this.loadingService.setLoading(false);
            const errors = (error?.message || '').split(':');
            const messages = (errors[1] || '').split(',');
            let content = '';

            if ((errors[0] || '').indexOf('500') > -1) {
              this.snackBar.open(
                'Your application could not be confirmed due to a server error. Please try again later',
                'Dismiss',
                {
                  duration: 6000,
                  verticalPosition: 'top',
                  panelClass: 'custom-snackbar',
                },
              );
            } else {
              if (messages?.length) {
                content = '<ul>';
                messages.forEach((msg) => {
                  content += '<li>' + msg.trim() + '</li>';
                });
                content += '</ul>';
              }
              this.snackBar.open(content, 'Dismiss', {
                duration: 6000,
                verticalPosition: 'top',
                panelClass: 'custom-snackbar',
              });
            }
          },
        });
    } else if (this.showConfirm) {
      if (this.applicationForm.valid) {
        let formData = this.applicationForm.value;
        formData.status = 'Segment assignment needed';
        const isCountiesValid = this.clearConfirmEmailandValidateCounties(
          formData,
        );
        if (isCountiesValid) {
          return;
        }
        if (this.showAgreementDetails) {
          formData = this.updateDateFormats(formData);
          formData = this.updatetxdotContact(formData);
        }
        formData = this.formatPhoneInput(formData);
        if (this.applicationId) {
          this.loadingService.setLoading(true);
          this.applicationsService
            .confirmApplicationById(formData, this.applicationId)
            .subscribe(
              () => {
                this.loadingService.setLoading(false);
                // remove confirm btn if confirm successful
                this.showConfirm = false;
                this.showUpdate = this.permissions.isAuthorized(
                  'agreements',
                  'update',
                );
                this.showSegment = this.permissions.isAuthorized(
                  'agreements',
                  'assignSegments',
                );
                this.displayConfirmStatusSuccess();
              },
              (error) => {
                this.loadingService.setLoading(false);
                this.handleError(error);
              },
            );
        }
      } else {
        this.formHelperService.validateForm(this.applicationForm);
      }
    }
  }

  backToAgreements() {
    this.router.navigateByUrl('/agreements/newAgreements');
  }

  displayConfirmStatusSuccess() {
    this.snackBar.open(
      `The ${this.appData.groupName} application Confirmed successfully.`,
      'Dismiss',
      {
        duration: 6000,
        verticalPosition: 'top',
        panelClass: 'custom-snackbar',
      },
    );
  }

  dateChange(type: string, event: MatDatepickerInputEvent<Date>, id: string) {
    console.log(type, event, id);
    console.log(event.value?.toLocaleDateString('en-us'));
    // this.applicationForm.controls[id].setValue(
    //   event.value.toLocaleDateString('en-us'),
    // );
  }

  disableAgreementDetails(): void {
    this.applicationForm.controls.txdotContactUserId.disable();
    this.applicationForm.controls.agreementStartDate.disable();
    this.applicationForm.controls.agreementEndDate.disable();
    this.applicationForm.controls.pickupsStartDate.disable();
    this.applicationForm.controls.requiredPickupsPerYear.disable();
  }

  /**
   * Loads application data with ID or tokens
   * @param params Request parameters containing ID or tokens
   */
  private loadApplicationData(params: Params) {
    // get app data function based on params
    const appDataFunc: Observable<Application> = this.applicationId
      ? this.applicationsService.getApplicationByApplicationId(
          params.applicationId,
        )
      : this.applicationsService.getApplicationByTokens(
          this.applicationToken,
          this.accessToken,
        );

    appDataFunc.subscribe((appData: Application) => {
      this.loadingService.setLoading(false);
      this.appData = appData;

      this.groupName = appData.groupName;
      if (appData.status === ApplicationStatus.RequestSignApproval) {
        this.showRequest = true;
      } else {
        this.showRequest = false;
      }

      this.phoneNumberControlsArr.forEach((control) => {
        this.convertPhone(control);
      });

      // enable validation for these fields if status is final review
      if (
        appData.status !== ApplicationStatus.FinalReviewCreateAgreement &&
        appData.status !== ApplicationStatus.DocumentCreated
      ) {
        this.disableAgreementDetails();
      } else {
        this.showAgreementDetails = true;
      }

      // set button states

      // application statuses where anonymous users can update/delete
      const anonymousCanUpdateStatuses: string[] = [
        ApplicationStatus.NotConfirmed,
      ];
      this.applicationStatus = appData.status;
      this.showConfirm = appData.status === ApplicationStatus.NotConfirmed;
      this.showSubmit = appData === undefined;

      // anonymous can only view update in Roadway Information Section when not confirmed, authenticated users can always update
      if (this.isAnonymousUser) {
        this.showSegment = false;
        this.showUpdate = anonymousCanUpdateStatuses.includes(appData.status);
      } else {
        this.showUpdate = this.permissions.isAuthorized('agreements', 'update');
        this.showSegment =
          appData.status != ApplicationStatus.NotConfirmed &&
          this.permissions.isAuthorized('agreements', 'assignSegments');
      }
      this.showDelete = this.showUpdate;

      // only set for applicationId
      if (this.applicationId || (this.applicationToken && this.accessToken)) {
        appData['primaryContactConfirmEmail'] = appData.primaryContactEmail;
        appData['secondaryContactConfirmEmail'] = appData.secondaryContactEmail;
        if (appData.schoolEmail) {
          appData['schoolConfirmEmail'] = appData.secondaryContactEmail;
        }
      }
      this.setConfirmEmailsValues();
      this.applicationForm.patchValue(appData);

      if (appData.aahSegmentId) {
        this.setDistrictCoordinators();
      }

      // convert string date into JS Date()
      if (appData.agreementStartDate) {
        console.log(new Date(appData.agreementStartDate));
        this.applicationForm.patchValue({
          agreementStartDate: new Date(appData.agreementStartDate),
        });
      }

      if (appData.agreementEndDate) {
        console.log(new Date(appData.agreementEndDate));
        this.applicationForm.patchValue({
          agreementEndDate: new Date(appData.agreementEndDate),
        });
      }

      if (appData.pickupsStartDate) {
        console.log(new Date(appData.pickupsStartDate));
        this.applicationForm.patchValue({
          pickupsStartDate: new Date(appData.pickupsStartDate),
        });
      }

      // calc initial max line length
      if (this.applicationForm.controls.signLine_4.value.trim().length > 0) {
        this.maxLineLength = 13;
      }

      this.validateSign(true, false);
    });
  }

  validateSign(trimBefore: boolean, trimAfter: boolean) {
    const signArrControls = [
      'signLine_1',
      'signLine_2',
      'signLine_3',
      'signLine_4',
    ];

    signArrControls.forEach((controlName) => {
      // trim
      if (trimBefore) {
        this.applicationForm.controls[controlName].setValue(
          this.applicationForm.controls[controlName].value.trim(),
        );
      }
      // create max line length and space validators
      if (controlName === 'signLine_1') {
        console.log('max line length:', this.maxLineLength);
        console.log(
          'line 2 length:',
          this.applicationForm.controls.signLine_2.value.length,
        );
        this.applicationForm.controls[controlName].setValidators([
          Validators.maxLength(this.maxLineLength),
          this.spaceValidation(),
          Validators.required,
        ]);
      } else {
        this.applicationForm.controls[controlName].setValidators([
          Validators.maxLength(this.maxLineLength),
          this.spaceValidation(),
          this.lineValidation(controlName),
        ]);
        this.applicationForm.controls[controlName].updateValueAndValidity();
      }

      if (trimAfter) {
        this.applicationForm.controls[controlName].setValue(
          this.applicationForm.controls[controlName].value.trim(),
        );
      }
    });
  }

  enableDisableSignLine() {
    if (this.applicationForm.controls.signLine_1.value === '') {
      this.applicationForm.controls.signLine_2.disable();
      this.applicationForm.controls.signLine_3.disable();
      this.applicationForm.controls.signLine_4.disable();
    } else if (this.applicationForm.controls.signLine_2.value === '') {
      this.applicationForm.controls.signLine_3.disable();
      this.applicationForm.controls.signLcine_4.disable();
    } else if (this.applicationForm.controls.signLine_3.value === '') {
      this.applicationForm.controls.signLine_4.disable();
    }
  }

  convertPhone(controlName: string) {
    let phoneDigitsOnly: string;
    let contactNumberControl: CustomTel;
    if (this.appData[controlName]) {
      phoneDigitsOnly = this.appData[controlName].replace(/\D/g, '');
      if (phoneDigitsOnly.length === 10) {
        this.isPhoneValid = true;
        console.log(phoneDigitsOnly);
        this.applicationForm.controls[controlName].setValue({
          area: phoneDigitsOnly.slice(0, 3),
          exchange: phoneDigitsOnly.slice(3, 6),
          subscriber: phoneDigitsOnly.slice(6, 10),
        });
      } else {
        this.applicationForm.controls[controlName].setValue({
          area: null,
          exchange: null,
          subscriber: null,
        });
      }
    } else {
      this.applicationForm.controls[controlName].setValue({
        area: null,
        exchange: null,
        subscriber: null,
      });
    }
  }

  phoneUpdate() {
    if (this.applicationForm.value.contactNumber) {
      const comboVal = `${this.applicationForm.value.contactNumber.area}-${this.applicationForm.value.contactNumber.exchange}-${this.applicationForm.value.contactNumber.subscriber}`;
      const digitsOnly = comboVal.replace(/\D/g, '');
      if (digitsOnly.length === 10) {
        this.isPhoneValid = true;
      } else {
        this.isPhoneValid = false;
      }
    } else {
      console.log(this.applicationForm.value);
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

  formatPhoneInput(formData: any) {
    this.phoneNumberControlsArr.forEach((phoneNumberControl) => {
      const input = this.applicationForm.controls[phoneNumberControl].value;
      if (input?.area) {
        formData[
          phoneNumberControl
        ] = `${input.area}-${input.exchange}-${input.subscriber}`;
        return input;
      }
      return null;
    });
    return formData;
  }

  /**
   * Determine if the user is authenticated
   * @returns true when the user has a role
   */
  private isUserAuthenticated(): boolean {
    // check if user is authenticated
    let result = false;
    this.authService.getUserValue().subscribe((data: User) => {
      if (data) {
        this.currentRole = this.authService.getSelectedRoleType();
        const roles: string[] = [
          this.roles.Administrator,
          this.roles.District,
          this.roles.Maintenance,
        ];
        result = roles.includes(this.currentRole);
      }
    });

    return result;
  }

  onSegementIdBlur() {
    if (this.applicationForm.value.aahSegmentId) {
      this.applicationsService
        .getSegmentById(this.applicationForm.value.aahSegmentId)
        .subscribe(
          (segmentDetails) => {
            this.applicationForm.controls.aahRouteName.setValue(
              segmentDetails['aahRouteName'],
            );
          },
          () => {
            this.snackBar.open(
              'There is no available segment with ID ' +
                this.applicationForm.value.aahSegmentId,
              'Dismiss',
              {
                duration: 6000,
                verticalPosition: 'top',
                panelClass: 'custom-snackbar',
              },
            );
          },
        );
    }
  }
  displayFn = (county) => {
    return !isNaN(county) ? this.fetchCountyName(county) : '';
  };
  onApprove(): void {
    const applicationDetails = {
      applicationId: this.applicationId,
      dcName: this.getDcName(
        this.applicationForm.controls.txdotContactUserId.value,
      ),
    };
    const dialogRef = this.dialog.open(ApproveApplicationDialogComponent, {
      width: '550px',
      panelClass: 'approval-dialog-container',
      data: applicationDetails,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.data == 'approved') {
        this.applicationStatus = 'Final review/Create agreement';
        this.snackBar.open(
          'The application has been approved and an email was sent to the primary contact',
          'Dismiss',
          {
            duration: 6000,
            verticalPosition: 'top',
            panelClass: 'custom-snackbar',
          },
        );
      }
    });
  }

  onReject(): void {
    const applicationDetails = {
      applicationId: this.applicationId,
      dcName: this.dcName,
    };
    const dialogRef = this.dialog.open(RejectApplicationDialogComponent, {
      width: '550px',
      panelClass: 'approval-dialog-container',
      data: applicationDetails,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.data == 'rejected') {
        this.applicationStatus = 'Sign name denied';
        this.snackBar.open(
          'The application has been rejected and an email was sent to the primary contact',
          'Dismiss',
          {
            duration: 6000,
            verticalPosition: 'top',
            panelClass: 'custom-snackbar',
          },
        );
      }
    });
  }

  sendCreateSigningRequest(): void {
    this.applicationsService.createSigningRequest(this.applicationId).subscribe(
      () => {
        this.snackBar.open(
          `The application for ${this.appData.groupName} was submitted successfully.`,
          'Dismiss',
          {
            duration: 6000,
            verticalPosition: 'top',
            panelClass: 'custom-snackbar',
          },
        );
      },
      () => {
        this.snackBar.open(
          `The application for ${this.appData.groupName} could not be sent successfully. If you continue to receive this message, please notify the Adopt-A-Highway Admin.`,
          'Dismiss',
          {
            duration: 6000,
            verticalPosition: 'top',
            panelClass: 'custom-snackbar',
          },
        );
      },
    );
  }

  updateDateFormats(formData) {
    formData.agreementStartDate =
      formData.agreementStartDate.toString().length > 10
        ? formatDate(new Date(formData.agreementStartDate), 'MM/dd/yyyy', 'en')
        : formData.agreementStartDate;
    formData.agreementEndDate =
      formData.agreementEndDate.toString().length > 10
        ? formatDate(new Date(formData.agreementEndDate), 'MM/dd/yyyy', 'en')
        : formData.agreementEndDate;
    formData.pickupsStartDate =
      formData.pickupsStartDate.toString().length > 10
        ? formatDate(new Date(formData.pickupsStartDate), 'MM/dd/yyyy', 'en')
        : formData.pickupsStartDate;
    return formData;
  }

  updatetxdotContact(formData: any) {
    console.log(formData, this.districtCoordinators);
    if (!isNaN(formData.txdotContactFullName)) {
      const dcInfo = this.districtCoordinators.find(
        (coord) => coord.id === formData.txdotContactFullName,
      );
      formData.txdotContactFullName = `${dcInfo.firstName} ${dcInfo.lastName}`;
      formData.txdotContactEmail = dcInfo.emails[0].value;
      formData.txdotContactPhoneNumber = dcInfo.phones[0].value;
    }

    return formData;
  }

  getDcName(id: number) {
    if (id) {
      const dcInfo = this.districtCoordinators.find((coord) => coord.id === id);
      return dcInfo.fullName;
    }
  }
}

@Component({
  selector: 'delete-dialog',
  templateUrl: './delete-dialog.html',
  styleUrls: ['./application.component.css'],
})
export class DeleteApplicationDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DeleteApplicationDialog>,
    private applicationsService: ApplicationsService,
    private snackBar: MatSnackBar,
  ) {}

  deleteApp() {
    if (this.data.applicationToken) {
      this.applicationsService
        .deleteApplication(this.data.applicationToken, this.data.accessToken)
        .subscribe({
          complete: () => {
            this.dialogRef.close({ data: 'deleted' });
          },
          error: (error) => {
            const errors = (error?.message || '').split(':');
            const messages = (errors[1] || '').split(',');
            let content = '';

            if ((errors[0] || '').indexOf('500') > -1) {
              this.snackBar.open(
                'Your application could not be deleted due to a server error. Please try again later',
                'Dismiss',
                {
                  duration: 6000,
                  verticalPosition: 'top',
                  panelClass: 'custom-snackbar',
                },
              );
            } else {
              if (messages?.length) {
                content = '<ul>';
                messages.forEach((msg) => {
                  content += '<li>' + msg.trim() + '</li>';
                });
                content += '</ul>';
              }
              this.snackBar.open(content, 'Dismiss', {
                duration: 6000,
                verticalPosition: 'top',
                panelClass: 'custom-snackbar',
              });
            }
          },
        });
    } else if (this.data.applicationId) {
      this.applicationsService
        .deleteApplicationByApplicationId(this.data.applicationId)
        .subscribe({
          complete: () => {
            this.dialogRef.close({ data: 'deleted' });
          },
          error: (error) => {
            const errors = (error?.message || '').split(':');
            const messages = (errors[1] || '').split(',');
            let content = '';

            if ((errors[0] || '').indexOf('500') > -1) {
              this.snackBar.open(
                'Your application could not be deleted due to a server error. Please try again later',
                'Dismiss',
                {
                  duration: 6000,
                  verticalPosition: 'top',
                  panelClass: 'custom-snackbar',
                },
              );
            } else {
              if (messages?.length) {
                content = '<ul>';
                messages.forEach((msg) => {
                  content += '<li>' + msg.trim() + '</li>';
                });
                content += '</ul>';
              }
              this.snackBar.open(content, 'Dismiss', {
                duration: 6000,
                verticalPosition: 'top',
                panelClass: 'custom-snackbar',
              });
            }
          },
        });
    }
  }

  onNoClick(): void {
    console.log('no click');
  }
}
