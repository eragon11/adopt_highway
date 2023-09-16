import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Page } from 'src/app/common/models/page';
import { UsersDataService } from '../services/users-data.service';
import { UsersFilterService } from '../services/users-filter.service';
import { User } from 'src/app/auth/_models';
import { catchError } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'user-list',
  template: `
    <div id="user-list-header-container">
      <user-list-header></user-list-header>
      <users-filter></users-filter>
    </div>
    <user-list-body
      [tableData]="userData"
      [isPageable]="pageable"
      (pgEvent)="receivePageEvent($event)"
      [length]="length"
      [defaultUsersPageSize]="pageSize"
    >
    </user-list-body>
  `,
  styles: ['user-list { width: 100%; }'],
  styleUrls: [
    '../user-filter/users-filter.component.css',
    './user-list-header.component.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class UserListComponent implements OnInit {
  constructor(
    public usersDataService: UsersDataService,
    public userFilter: UsersFilterService,
  ) { }
  userData: User[];
  page: Page<any>;
  length: number;
  filterSubscriptions: Subscription[];
  currentPage: Page<User>;
  pageSizeOptions: number[] = environment.paginationSizes;
  pageSize: number = environment.defaultUsersPageSize;
  pageable = true;

  ngOnInit() {
    this.currentPage = new Page<User>();
    this.filterSubscriptions = this.setDataFilter();
  }

  ngOnDestroy() {
    this.filterSubscriptions.forEach((rpt) => {
      rpt.unsubscribe();
    });
  }

  receivePageEvent($event: PageEvent) {
    const page = $event.pageIndex + 1;
    const pageSize = $event.pageSize;
    this.currentPage.setPageNumber(page);
    this.currentPage.setPageSize(pageSize);
    this.loadData(this.currentPage);
  }

  resetPaginationOnFilterChange(){
    this.currentPage = new Page<User>();
    this.currentPage.setPageNumber(1);
  }

  setDataFilter(): Subscription[] {
    const rptSubscriptions: Subscription[] = [];
    //collecting the subscriptions for the filters so we can destroy them in the ngOnDestroy function
    rptSubscriptions.push(
      this.userFilter.getReportFilterSubj().subscribe((filterData) => {
        //if we get a date object then we know that it was called due to a user action
        if (filterData) {
          this.currentPage.setFilters(filterData);
          this.loadData(this.currentPage);
        } else {
          //The current default number of records coming back from the API is 10
          //Setting the page size to 12 on initial load to fill up the page.
          //This can be removed once the API catches up
          this.currentPage.setPageSize(this.pageSize);
          this.loadData(this.currentPage);
        }
      }),
    );
    return rptSubscriptions;
  }

  // loadData( offset: number = 0, limit: number = 10, predicates?: any ) : void {
  loadData(_pg: Page<any>): void {
    this.usersDataService
      .getUsersData(this.currentPage)
      .pipe(catchError(() => of([])))
      .subscribe(
        (res: Page<any>) => {

          this.userData = [];
          this.userData = res;
          //calling slice to produce a new array so the setter gets called.
          //otherwise, the reference to the array is the same and no change is detected
          this.userData = this.userData.slice();
          if (res) {
            if (res.length === 0) {
              this.length = 0;
              //turn off the paginator if no records found
              this.pageable = false;
            } else {
              this.length = res.getTotalItemCount();
              if (this.userFilter.resetPagination)
                this.resetPaginationOnFilterChange();
              if (res.getTotalItemCount() > this.pageSize) this.pageable = true;
              else this.pageable = false;
            }
          }
        },
        (error) => {
          console.error(
            `UsersDataService:loadData Error loading data ${error}`,
          );
        },
      );
  }
}
