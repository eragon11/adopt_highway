import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApplicationsService } from 'src/app/services/applications.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/common/services/loader.service';
@Component({
  selector: 'app-application-sign-dialog',
  templateUrl: './application-sign-dialog.component.html',
  styleUrls: ['./application-sign-dialog.component.css'],
})
export class ApplicationSignDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ApplicationSignDialogComponent>,
    private applicationsService: ApplicationsService,
    private snackBar: MatSnackBar,
    private router: Router,
    private loadingService: LoaderService,
  ) {}

  ngOnInit(): void {}

  sendCreateSigningRequest(): void {
    this.loadingService.setLoading(true);
    this.applicationsService
      .createSigningRequest(this.data.applicationId)
      .subscribe(
        () => {
          this.loadingService.setLoading(false);
          this.snackBar.open(
            `The application for ${this.data.groupName} was submitted successfully.`,
            'Dismiss',
            {
              duration: 6000,
              verticalPosition: 'top',
              panelClass: 'custom-snackbar',
            },
          );
          this.router.navigateByUrl('/agreements/newAgreements');
        },
        () => {
          this.loadingService.setLoading(false);
          this.snackBar.open(
            `The application for ${this.data.groupName} could not be sent successfully. If you continue to receive this message, please notify the Adopt-A-Highway Admin.`,
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

  onNoClick(): void {
    console.log('no click');
  }
}
