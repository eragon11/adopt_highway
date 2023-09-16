import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ReportFilter } from 'src/app/reporting/reports/models/report-filter';
import { DateRange } from '../reports/models/date-range';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReportFilterService {
  private district: string = null;
  private maintOffice: string = null;
  private county: string = null;
  private startDate: string = null;
  private endDate: string = null;
  private currentFilter: ReportFilter;
  private reportFilter: BehaviorSubject<ReportFilter> = new BehaviorSubject<ReportFilter>(
    null,
  );

  constructor(private http: HttpClient) {}

  setCurrentFilter(
    dist?: string,
    maint?: string,
    cty?: string,
    sDate?: string,
    eDate?: string,
  ): ReportFilter {
    dist = dist ? dist : null;
    maint = maint ? maint : null;
    cty = cty ? cty : null;
    sDate = sDate ? sDate : null;
    eDate = eDate ? eDate : null;
    const tempAF: ReportFilter = {
      district: dist,
      maintOffice: maint,
      county: cty,
      startdate: sDate,
      enddate: eDate,
    };
    this.district = tempAF.district;
    this.maintOffice = tempAF.maintOffice;
    this.county = tempAF.county;
    this.startDate = tempAF.startdate;
    this.endDate = tempAF.enddate;
    return tempAF;
  }

  setCurrentAreaFilter(
    dist?: string,
    maint?: string,
    cty?: string,
  ): ReportFilter {
    dist = dist ? dist : null;
    maint = maint ? maint : null;
    cty = cty ? cty : null;
    const tempAF: ReportFilter = {
      district: dist,
      maintOffice: maint,
      county: cty,
      startdate: this.startDate,
      enddate: this.endDate,
    };
    this.district = tempAF.district;
    this.maintOffice = tempAF.maintOffice;
    this.county = tempAF.county;
    return tempAF;
  }

  setCurrentDateFilter(sDate?: string, eDate?: string): ReportFilter {
    sDate = sDate ? sDate : null;
    eDate = eDate ? eDate : null;
    const tempAF: ReportFilter = {
      district: this.district,
      maintOffice: this.maintOffice,
      county: this.county,
      startdate: sDate,
      enddate: eDate,
    };
    this.startDate = tempAF.startdate;
    this.endDate = tempAF.enddate;
    return tempAF;
  }

  setDateRangeFilter(dateRange: DateRange) {
    this.currentFilter = this.setCurrentDateFilter(
      dateRange.startDate,
      dateRange.endDate,
    );
    this.reportFilter.next(this.currentFilter);
  }

  clearDateRange() {
    const newDateRange: DateRange = { startDate: null, endDate: null };
    this.currentFilter.startdate = null;
    this.currentFilter.enddate = null;
    this.startDate = null;
    this.endDate = null;
    this.reportFilter.next(this.currentFilter);
  }

  setDistrict(districtID: string): void {
    //if we are setting district then we need to unset maint ofc and county
    this.currentFilter = this.setCurrentAreaFilter(districtID);
    //now lets push out the update
    this.reportFilter.next(this.currentFilter);
  }

  getDistrict(): string {
    return this.currentFilter.district;
  }

  setMaintOffice(districtID: string, maintOfcID: string): void {
    this.currentFilter = this.setCurrentAreaFilter(districtID, maintOfcID);
    //now lets push out the update
    this.reportFilter.next(this.currentFilter);
  }

  getMaintOffice(): string {
    return this.currentFilter.maintOffice;
  }

  setCounty(districtID?: string, maintOfcID?: string, countyID?: string): void {
    //the county filter is being set. It can be set along with the
    //district and maint ofc filters or on its own so we mush verify the state
    if (districtID) {
      if (maintOfcID) {
        this.currentFilter = this.setCurrentAreaFilter(
          districtID,
          maintOfcID,
          countyID,
        );
        //now lets push out the update
        this.reportFilter.next(this.currentFilter);
      } else {
        console.error(
          `AreaFilterService:setCounty: Error: Trying to set county filter. The district filter was passed in but the maint office filter was not`,
        );
      }
    } else {
      //need to clear the other filters and only leave the county filter
      this.currentFilter = this.setCurrentAreaFilter(null, null, countyID);
      //now lets push out the update
      this.reportFilter.next(this.currentFilter);
    }
  }

  getCounty(): string {
    return this.currentFilter.county;
  }

  getReportFilterSubj(): Observable<ReportFilter> {
    return this.reportFilter;
  }

  clearAreaFilters() {
    //need to clear all of the filters
    this.currentFilter = this.setCurrentAreaFilter(null, null, null);
    //now lets push out the update
    this.reportFilter.next(this.currentFilter);
  }
}
