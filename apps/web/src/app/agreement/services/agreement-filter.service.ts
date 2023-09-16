import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AgreementFilter } from '../models/agreement-filter';

@Injectable({
  providedIn: 'root',
})
// The UsersFilterService is used to capture the current state of the filters on the page. The UsersFilter object is populated
// with the filters chosen by the user and then it is communicated via the agreementFilter BehaviorSubject which is subscribed to
// in the UserListComponent. The user filter object will be used to create a Page object which is used to make the api call
export class AgreementFilterService {
  private district: string = null;
  private county: string = null;
  private groupName: string = null;
  private currentFilter: AgreementFilter;
  private agreementFilter: BehaviorSubject<AgreementFilter> = new BehaviorSubject<AgreementFilter>(
    null,
  );

  constructor() {}
  setCurrentFilter(
    dist?: string,
    cty?: string,
    name?: string,
  ): AgreementFilter {
    dist = dist ? dist : null;
    cty = cty ? cty : null;
    name = name ? name : null;
    const tempFilters: AgreementFilter = {
      district: dist,
      county: cty,
      groupName: name,
    };
    this.district = tempFilters.district;
    this.county = tempFilters.county;
    this.groupName = tempFilters.groupName;
    return tempFilters;
  }

  setCurrentagreementFilter(groupName?: string): AgreementFilter {
    groupName = groupName ? groupName : null;
    const agreementFilter: AgreementFilter = {
      district: this.district,
      county: this.county,
      groupName: groupName,
    };
    this.groupName = agreementFilter.groupName;
    return agreementFilter;
  }

  // Used to grab the BehaviorSubject to subscribe and receive updates
  getAgreementFilterSubj(): Observable<AgreementFilter> {
    return this.agreementFilter;
  }

  setDistrict(districtID: string): void {
    //if we are setting district then we need to unset county
    this.currentFilter = this.setCurrentFilter(districtID);
    this.agreementFilter.next(this.currentFilter);
  }

  setCounty(districtID: string, countyID: string): void {
    this.currentFilter = this.setCurrentFilter(districtID, countyID);
    this.agreementFilter.next(this.currentFilter);
  }

  resetToDistrictFilter(districtID: string) {
    // User has deleted county input so
    // need to clear the countyFilter
    this.currentFilter = this.setCurrentFilter(
      districtID,
      null,
      this.groupName,
    );
    this.agreementFilter.next(this.currentFilter);
  }

  setSearchStr(groupName: string): void {
    this.currentFilter = this.setCurrentagreementFilter(groupName);
    this.agreementFilter.next(this.currentFilter);
  }

  clearAllFilters() {
    // clear all filters
    this.currentFilter = this.setCurrentFilter();
    this.agreementFilter.next(this.currentFilter);
  }

  clearAreaFilters() {
    this.currentFilter = this.setCurrentFilter(null, null, this.groupName);
    this.agreementFilter.next(this.currentFilter);
  }
}
