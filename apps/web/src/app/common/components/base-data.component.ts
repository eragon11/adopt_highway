import { Component } from '@angular/core';
import { TableColumn } from 'src/app/reporting/reports/models/TableColumn';
import { DataService } from 'src/app/common/services/data.service';
import { catchError, tap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { Page } from 'src/app/common/models/page';
import { environment } from 'src/environments/environment';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { DataFilterService } from '../services/data-filter.service';


@Component({
  template: ``,
})

// This class is used to provide all of the common functions used in the data retrieval.
// It is used to retrieve data, sort data, paginate data, etc.
// An individual class would extend this class to use the functions provided
// Currently, it is only used by REPORTS. USERS has its own data base component (UserListComponent)
// Refactor opportunity to use this base data component for reports AND users
export class BaseDataComponent {
  reportTableColumns: TableColumn[];
  reportData: any[];
  page: Page<any>;
  length: number;
  currentPage: Page<any>;
  pageSizeOptions: number[] = environment.paginationSizes;
  pageSize: number = environment.defaultUsersPageSize;
  public districtFilter: string = null;
  public maintOfcFilter: string = null;
  public countyFilter: string = null;
  pageable = true;
  // MatPaginator Output
  // pageEvent: PageEvent;

  constructor(
    public dataService: DataService,
    public reportsFilter: DataFilterService,
  ) {}

  sortData($event: Sort) {
    const sortField = $event.active;
    const sortDir = $event.direction.toLocaleUpperCase();
    this.currentPage.setSortField(sortField);
    this.currentPage.setSortDirection(sortDir);
    this.loadData(this.currentPage);
  }

  receivePageEvent($event: PageEvent) {
    const page = $event.pageIndex + 1;
    const pageSize = $event.pageSize;
    this.currentPage.setPageNumber(page);
    this.currentPage.setPageSize(pageSize);
    this.loadData(this.currentPage);
  }

  setDataFilter(): Subscription[] {
    const rptSubscriptions: Subscription[] = [];
    // const filter =
    //   reportType === 'users' ? this.usersFilter : this.reportsFilter;
    //collecting the subscriptions for the filters so we can destroy them in the ngOnDestroy function
    rptSubscriptions.push(
      this.reportsFilter.getReportFilterSubj().subscribe((filterData) => {
        //if we get a date object then we know that it was called due to a user action
        if (filterData) {
          this.currentPage.setFilters(filterData);
          this.loadData(this.currentPage);
        } else {
          this.loadData(this.currentPage);
        }
      }),
    );
    return rptSubscriptions;
  }

  // loadData( offset: number = 0, limit: number = 10, predicates?: any ) : void {
  loadData(pg: Page<any>): void {
    this.dataService
      .getReportData(this.currentPage)
      .pipe(catchError(() => of([])))
      .subscribe(
        (res: Page<any>) => {
          this.reportData = [];
          this.reportData = res;
          //calling slice to produce a new array so the setter gets called.
          //otherwise, the reference to the array is the same and no change is detected
          this.reportData = this.reportData.slice();
          if (res) {
            if (res.length === 0) {
              this.length = 0;
              //turn off the paginator if no records found
              this.pageable = false;
            } else {
              this.length = res.getTotalItemCount();
              this.pageable = true;
            }
          }
        },
        (error) => {
          console.error(`DataService:loadData Error loading data ${error}`);
        },
      );
  }

  getDefaultSortValues(): [string, string] {
    const url = this.dataService.getCurrentURL();
    console.warn(`Getting default sort values with url ${url}`);
    let sortFields = null;
    environment.reports.forEach((ele) => {
      if (ele.url === url) {
        sortFields = [
          ele.defaultSortField,
          ele.defaultSortDirection.toLocaleUpperCase(),
        ];
      }
    });
    if (sortFields) {
      return sortFields;
    } else {
      console.error(
        `BaseDataComponent:getDefaultSortValues: Error, looking for the default sort values for url: ${url} but could not find any`,
      );
    }
  }
}
