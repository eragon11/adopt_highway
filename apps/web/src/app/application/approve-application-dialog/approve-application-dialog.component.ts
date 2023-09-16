/* eslint-disable prettier/prettier */
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from 'src/app/common/services/loader.service';
import { ApplicationsService } from 'src/app/services/applications.service';

@Component({
  selector: 'app-approve-application-dialog',
  templateUrl: './approve-application-dialog.component.html',
  styleUrls: ['./approve-application-dialog.component.css']
})
export class ApproveApplicationDialogComponent {
  dcName = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ApproveApplicationDialogComponent>,
    private applicationsService: ApplicationsService,
    private snackBar: MatSnackBar,
    private loadingService: LoaderService
    ) {
      this.dcName = this.data.dcName;
  }


  onApproveClick() {
    this.loadingService.setLoading(true);
    this.applicationsService.approveSignInRequest(this.data.applicationId)
    .subscribe({
      complete: () => {
        this.loadingService.setLoading(false);
        this.dialogRef.close({ data: 'approved' });
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
