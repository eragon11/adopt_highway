/* eslint-disable prettier/prettier */
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from 'src/app/common/services/loader.service';
import { ApplicationsService } from 'src/app/services/applications.service';
import { ApproveApplicationDialogComponent } from '../approve-application-dialog/approve-application-dialog.component';

@Component({
  selector: 'app-reject-application-dialog',
  templateUrl: './reject-application-dialog.component.html',
  styleUrls: ['./reject-application-dialog.component.css']
})
export class RejectApplicationDialogComponent {
  dcName = '';
  description = '';
  rejectForm = new FormGroup({
    description: new FormControl(),
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ApproveApplicationDialogComponent>,
    private applicationsService: ApplicationsService,
    private snackBar: MatSnackBar,
    private loadingService: LoaderService
  ) {
    this.dcName = this.data.dcName;
  }


  onRejectClick() {
    const rejectComments = {
      'signRejectionComments':  this.rejectForm.controls.description.value
    };
    this.loadingService.setLoading(true);
    this.applicationsService.rejectSignInRequest(this.data.applicationId,rejectComments)
    .subscribe({
      complete: () => {
        this.loadingService.setLoading(false);
        this.dialogRef.close({ data: 'rejected' });
      },
      error: () => {
        this.loadingService.setLoading(false);
        this.handleError();
      },
    });
  }

  onCancelClick() {
    this.dialogRef.close({ data: 'cancel' });
  }

  handleError() {
    this.snackBar.open(
      'Your action could not be completed successfully. Please try again. If this error persists, please contact the adminstrator.',
      'Dismiss',
      {
        duration: 6000,
        verticalPosition: 'top',
        panelClass: 'custom-snackbar',
      },
    );
  }
}
