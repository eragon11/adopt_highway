/* eslint-disable prettier/prettier */
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AgreementService } from 'src/app/services/agreement.service';

@Component({
  selector: 'app-active-agreement-overview',
  templateUrl: './active-agreement-overview.component.html',
  styleUrls: ['./active-agreement-overview.component.css'],
})
export class ActiveAgreementOverviewComponent implements OnInit {
  activeAgreementId = '';
  agreementDetails: any = {};
  isDataLoaded = false;
  mode: ProgressSpinnerMode = 'indeterminate';
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public agreementService: AgreementService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.params;
    this.activeAgreementId = params.agreementId;
    this.agreementService.getAgreementDetails(this.activeAgreementId).subscribe(
      (resp) => {
        this.isDataLoaded = true;
        if (resp) {
          this.agreementDetails = resp;
        } else {
          this.snackBar.open(
            'Unable to fetch the agreement details.',
            'Dismiss',
            {
              duration: 6000,
              verticalPosition: 'top',
              panelClass: 'custom-snackbar',
            },
          );
        }
      },
      (error) => {
        this.isDataLoaded = true;
        this.snackBar.open(
          'Unable to fetch the agreement details.',
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

  backToActiveAgreements(): void {
    this.router.navigateByUrl('/agreements/activeAgreements');
  }
}
