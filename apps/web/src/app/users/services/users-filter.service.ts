import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsersFilter } from 'src/app/users/models/users-filter';

@Injectable({
  providedIn: 'root',
})

// The UsersFilterService is used to capture the current state of the filters on the page. The UsersFilter object is populated
// with the filters chosen by the user and then it is communicated via the userFilter BehaviorSubject which is subscribed to
// in the UserListComponent. The user filter object will be used to create a Page object which is used to make the api call
export class UsersFilterService {
  private district: string = null;
  private maintOffice: string = null;
  private userName: string = null;
  private userRoles: string[];
  private currentFilter: UsersFilter;
  private userFilter: BehaviorSubject<UsersFilter> = new BehaviorSubject<UsersFilter>(
    null,
  );

  public resetPagination: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );

  constructor() {}
  setCurrentFilter(dist?: string, maint?: string, name?: string, roles?: string[]): UsersFilter {
    dist = dist ? dist : null;
    maint = maint ? maint : null;
    name = name ? name : null;
    roles = roles ? roles : null;
    const tempFilters: UsersFilter = {
      district: dist,
      maintOffice: maint,
      userName: name,
      roles: roles,
    };
    this.district = tempFilters.district;
    this.maintOffice = tempFilters.maintOffice;
    this.userName = tempFilters.userName;
    this.userRoles = tempFilters.roles;
    return tempFilters;
  }

  setCurrentUserFilter(userName?: string): UsersFilter {
    userName = userName ? userName : null;
    const userFilter: UsersFilter = {
      district: this.district,
      maintOffice: this.maintOffice,
      userName: userName,
      roles: this.userRoles,
    };
    this.userName = userFilter.userName;
    return userFilter;
  }

  // Used to grab the BehaviorSubject to subscribe and receive updates
  getReportFilterSubj(): Observable<UsersFilter> {
    return this.userFilter;
  }

  setDistrict(districtID: string): void {
    //if we are setting district then we need to unset maint ofc and county
    this.currentFilter = this.setCurrentFilter(districtID);
    this.userFilter.next(this.currentFilter);
  }

  setMaintOffice(districtID: string, maintOfcID: string): void {
    this.currentFilter = this.setCurrentFilter(districtID, maintOfcID);
    this.userFilter.next(this.currentFilter);
  }

  resetToDistrictFilter(districtID: string) {
    // User has deleted Maintenance Section input so
    // need to clear the maintenanceSectionFilter
    this.currentFilter = this.setCurrentFilter(districtID, null, this.userName, this.userRoles);
    this.userFilter.next(this.currentFilter);
  }

  setSearchStr(userName: string): void {
    this.currentFilter = this.setCurrentUserFilter(userName);
    this.userFilter.next(this.currentFilter);
  }

  setUserRoles(userRoles: string[]): void {
    this.currentFilter = this.setCurrentFilter(this.district, this.maintOffice, this.userName, userRoles);
    this.userFilter.next(this.currentFilter);
    this.resetPagination.next(true);
  }

  clearAllFilters() {
    // clear all filters
    this.currentFilter = this.setCurrentFilter();
    this.userFilter.next(this.currentFilter);
  }

  clearAreaFilters() {
    this.currentFilter = this.setCurrentFilter(null, null, this.userName, this.userRoles);
    this.userFilter.next(this.currentFilter);
  }

  clearUserRoles() {
    this.currentFilter = this.setCurrentFilter(this.district, this.maintOffice, this.userName, null);
    this.userFilter.next(this.currentFilter);;
  }
}
