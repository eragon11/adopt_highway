/* eslint-disable prettier/prettier */
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Activeagreements } from 'src/app/models/activeAgreements.model';
import { AgreementService } from 'src/app/services/agreement.service';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { AgreementFilterService } from 'src/app/agreement/services/agreement-filter.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Page } from 'src/app/common/models/page';
import { of } from 'rxjs/internal/observable/of';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/common/services/loader.service';

@Component({
  selector: 'app-active-agreement-list',
  templateUrl: './active-agreement-list.component.html',
  styleUrls: ['./active-agreement-list.component.css']
})
export class ActiveAgreementListComponent implements OnInit {
  
  activeAgreements: MatTableDataSource<any>;
  displayedColumns: string[] = [
    "PDF",
    "Start Date",
    "End Date",
    "Group Name",
    "Contact Name",
    "Contact Email",
    "District",
    "Maintainance Section",
    "Segment Name"
  ];
  filterSubscriptions: Subscription[];
  currentPage: Page<Activeagreements>;
  
  @ViewChild(MatPaginator, { static: false }) matPaginator: MatPaginator;

  @Input() isPageable = false;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() rowActionIcon: string;
  @Input() paginationSizes = environment.paginationSizes;
  @Input() defaultPageSize = environment.defaultPageSize;
  @Input() showFirstLastButtons = environment.showFirstLastButtons;
  
  
  @Output() pgEvent: EventEmitter<PageEvent> = new EventEmitter();

  constructor(private agreementService: AgreementService,
    private snackBar: MatSnackBar,
    public agreementFilter: AgreementFilterService,
    private router: Router,
    public loadingService:LoaderService)
  { }

  ngOnInit(): void {
    this.currentPage = new Page<Activeagreements>();
    this.agreementFilter.clearAllFilters();
    this.loadingService.setLoading(true);
    this.filterSubscriptions = this.setDataFilter();
  }

  ngOnDestroy() {
    this.filterSubscriptions.forEach((rpt) => {
      rpt.unsubscribe();
    });
  }

  getActiveAgreements(){
    this.agreementService.getActiveAgreementService().subscribe( (resp) => {
      this.loadingService.setLoading(true);
      if(resp){
      this.activeAgreements = new MatTableDataSource(resp['items']);
      this.activeAgreements.paginator = this.matPaginator;

      }else{
        this.snackBar.open(
          'Unable to fetch the active agreements.',
          'Dismiss',
          {
            duration: 6000,
            verticalPosition: 'top',
            panelClass: 'custom-snackbar',
          },
        );
      }
    })
  }
  
  onPaginate(event: PageEvent) {
    this.pgEvent.emit(event);
  }

  setDataFilter(): Subscription[] {
    const rptSubscriptions: Subscription[] = [];
    //collecting the subscriptions for the filters so we can destroy them in the ngOnDestroy function
    rptSubscriptions.push(
      this.agreementFilter.getAgreementFilterSubj().subscribe((filterData) => {
        //if we get a date object then we know that it was called due to a user action
        if (filterData) {
          this.currentPage.setFilters(filterData);
          this.filterData(this.currentPage);
        }
        else {
          this.getActiveAgreements();
        }
      }),
    );
    return rptSubscriptions;
  } 
  
  filterData(_pg: Page<any>): void {
    this.agreementService
      .getFilteredActiveAgreements(_pg)
      .pipe(catchError(() => of([])))
      .subscribe(
        (res: Page<any>) => {
          this.loadingService.setLoading(false);
          this.activeAgreements = new MatTableDataSource(res);
          this.activeAgreements.paginator = this.matPaginator;
        },
        (error) => {
          this.loadingService.setLoading(false);
          console.error(
            `UsersDataService:loadData Error loading data ${error}`,
          );
        },
      );
  }
  overviewAgreement(activeAgreement:Activeagreements) {
    this.router.navigateByUrl('agreements/activeAgreements/'+activeAgreement.agreementId);
  }
  getPDF(url){
    this.agreementService.getPDF(url)
    .subscribe(
      async (data:Blob) => { const file = new Blob([data], { type: 'application/pdf' })
          const fileURL = URL.createObjectURL(file);
          const a       = document.createElement('a');
          a.href        = fileURL; 
          a.target      = '_blank';
          a.download    = 'agreement.pdf';
          document.body.appendChild(a);
          a.click();
      },
      async (error) => {
        console.log(error.message);
        if (error?.message?.includes('error 404')) {
          this.showErrorMessage('The document was not found');
         }       
        else if (error?.message?.includes('error 500')) {
          this.showErrorMessage('There was an internal server error. Please try again, or notify the administrator if the problem persists');
        }  
      }
    );
  }

  showErrorMessage (message: string) {
    this.snackBar.open(
      message,
      'Dismiss',
      {
        duration: 6000,
        verticalPosition: 'top',
        panelClass: 'custom-snackbar',
      },
    );
  }
}
