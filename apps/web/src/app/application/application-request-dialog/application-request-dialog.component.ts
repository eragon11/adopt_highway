import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from 'src/app/common/services/loader.service';
import { ApplicationsService } from 'src/app/services/applications.service';

@Component({
  selector: 'app-application-request-dialog',
  templateUrl: './application-request-dialog.component.html',
  styleUrls: ['./application-request-dialog.component.css'],
})
export class ApplicationRequestDialogComponent implements OnInit {
  requestForm: FormGroup;
  formIsValid = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ApplicationRequestDialogComponent>,
    private applicationsService: ApplicationsService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private loadingService: LoaderService,
  ) {}

  ngOnInit() {
    this.requestForm = this.fb.group({
      description: new FormControl(null),
    });
    console.log(this.data);
  }

  submitRequest(): void {
    console.log(this.requestForm.controls.description.value);
    let description: any = null;
    if (this.requestForm.controls.description.value) {
      description = {
        signRequestDescription: this.requestForm.controls.description.value,
      };
    }
    this.loadingService.setLoading(true);
    this.applicationsService
      .requestSignApprovalById(this.data.applicationId, description)
      .subscribe({
        complete: () => {
          this.loadingService.setLoading(false);
          this.dialogRef.close({ data: 'Request Sent' });
          this.snackBar.open(
            'Your request for sign approval has been submitted.',
            'Dismiss',
            {
              duration: 6000,
              verticalPosition: 'top',
              panelClass: 'custom-snackbar',
            },
          );
        },
        error: (error) => {
          this.loadingService.setLoading(false);
          const errors = (error?.message || '').split(':');
          const messages = (errors[1] || '').split(',');

          if ((errors[0] || '').indexOf('500') > -1) {
            this.snackBar.open(
              'Your request for sign approval could not be submitted due to a server error. Please try again later',
              'Dismiss',
              {
                duration: 6000,
                verticalPosition: 'top',
                panelClass: 'custom-snackbar',
              },
            );
          } else {
            if (messages?.length) {
              this.snackBar.open(messages, 'Dismiss', {
                duration: 6000,
                verticalPosition: 'top',
                panelClass: 'custom-snackbar',
              });
            }
          }
        },
      });
  }

  onNoClick(): void {
    console.log('no click');
  }
}
