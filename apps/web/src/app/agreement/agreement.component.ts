/* eslint-disable prettier/prettier */
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { AgreementService } from '../services/agreement.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AgreementFilterService } from './services/agreement-filter.service';
import { Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { Page } from '../common/models/page';
import { Agreement } from '../models/agreement.model';
import { catchError } from 'rxjs/operators';
import { LoaderService } from '../common/services/loader.service';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css'],
  providers: [AgreementService],
})
export class AgreementComponent implements OnInit {
  agreements: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'Date Submitted',
    'Group Name',
    'Contact Name',
    'Contact Email',
    'District',
    'County',
    'Segment Name',
    'Application Status',
  ];
  filterSubscriptions: Subscription[];
  currentPage: Page<Agreement>;
  
  @ViewChild(MatPaginator, { static: false }) matPaginator: MatPaginator;

  @Input() isPageable = false;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() rowActionIcon: string;
  @Input() paginationSizes = environment.paginationSizes;
  @Input() defaultPageSize = environment.defaultPageSize;
  @Input() showFirstLastButtons = environment.showFirstLastButtons;

  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  //this is not needed yet
  @Output() pgEvent: EventEmitter<PageEvent> = new EventEmitter();

  constructor(private agreementService: AgreementService,
    private snackBar: MatSnackBar,
    public agreementFilter: AgreementFilterService,
    private router: Router,    
    private loadingService: LoaderService
    ) {}

  ngOnInit(): void {
    this.currentPage = new Page<Agreement>();
    this.agreementFilter.clearAllFilters();
    this.loadingService.setLoading(true);
    this.filterSubscriptions = this.setDataFilter();
  }

  ngOnDestroy() {
    this.filterSubscriptions.forEach((rpt) => {
      rpt.unsubscribe();
    });
  }

  OnAgreementClick() {
    this.agreementService.getAgreementService().subscribe((resp) => {
      this.loadingService.setLoading(false);
      if(resp){
      this.agreements = new MatTableDataSource(resp['items']);
      this.agreements.paginator = this.matPaginator;

      }else{
        this.snackBar.open(
          'Unable to fetch the agreements.',
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

  setDataFilter(): Subscription[] {
    const rptSubscriptions: Subscription[] = [];
    //collecting the subscriptions for the filters so we can destroy them in the ngOnDestroy function
    rptSubscriptions.push(
      this.agreementFilter.getAgreementFilterSubj().subscribe((filterData) => {
        //if we get a date object then we know that it was called due to a user action
        if (filterData) {
          this.currentPage.setFilters(filterData);
          this.loadData(this.currentPage);
        }
        else {
          this.OnAgreementClick();
        }
      }),
    );
    return rptSubscriptions;
  }

  isTwoweeksOlder(selectedAgreement): boolean{
    if(selectedAgreement.notModified2Wks) {
      return false;
    }
    else {
      return true;
    }
  }

  is30DaysOlder(selectedAgreement): boolean{
    if(selectedAgreement.older30Days) {
      return false;
    }
    else {
      return true;
    }
  }

  onPaginate(event: PageEvent) {
    this.pgEvent.emit(event);
  }

  openApplication(applicationId:number) {
    this.router.navigateByUrl('/application/'+applicationId);
  }  

  loadData(_pg: Page<any>): void {
    this.agreementService
      .getFilteredAgreements(_pg)
      .pipe(catchError(() => of([])))
      .subscribe(
        (res: Page<any>) => {
          this.loadingService.setLoading(false);
          this.agreements = new MatTableDataSource(res);
          this.agreements.paginator = this.matPaginator;
        },
        (error) => {
          console.error(
            `UsersDataService:loadData Error loading data ${error}`,
          );
        },
      );
  }
}

