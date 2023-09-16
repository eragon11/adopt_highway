import { Component, ComponentFactoryResolver, EventEmitter, OnInit, Output, Type } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormGroup, FormControl } from '@angular/forms';
import { ReportingComponent } from '../reporting.component'
import { AgreementReportComponent } from '../reports/agreement-report.component'
import { PickupReportComponent } from '../reports/pickup-report.component'
import { DefaultReportComponent } from '../reports/default-report.component'
import { SegmentReportComponent } from '../reports/segment-report.component';
import { SignReportComponent } from '../reports/sign-report.component';
import { GroupTypeInfoReportComponent } from '../reports/group-type-info-report.component';
import { AgreementsByRenewalReportComponent } from '../reports/agreements-by-renewal-report.component';
import { GroupReportComponent } from '../reports/group-report.component';
import { ReportCard } from '../reports/models/reportCard';
import { DataService } from 'src/app/common/services/data.service';
import { Report } from '../report-section/report';
import { Observable, of } from 'rxjs';
import { Page } from 'src/app/common/models/page';
import { map } from 'rxjs/operators';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DataFilterService } from 'src/app/common/services/data-filter.service';

@Component({
  selector: 'app-report-icons',
  templateUrl: './report-icons.component.html',
  styleUrls: ['./report-icons.component.css']
})
export class ReportIconsComponent implements OnInit{

  private name: string
  private cardHighlighted: boolean = false;
  private highlightedCard: string;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  public reports = environment.reports
  public cardInfo: ReportCard[]

  @Output() dateFilter: EventEmitter<MatDatepickerInputEvent<any>>



  constructor(
    private router: Router,
    private reportingComponent: ReportingComponent,
    private dataFilter: DataFilterService,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.setCardInfo();
  }

  dateRangeChange(startDate: HTMLInputElement, endDate: HTMLInputElement) {
    let dateRangeObj;
    if (startDate.value && endDate.value) {
      dateRangeObj = {
        startDate: startDate.value,
        endDate: endDate.value
      }
      this.dataFilter.setDateRangeFilter(dateRangeObj);
    }

    // this.dateFilter.emit(startDate, endDate)
  }
  resetDates($event?) {
    this.dataFilter.clearDateRange();
    this.range.controls['start'].reset();
    this.range.controls['end'].reset();
  }

  setCardInfo () {
    const reportArray = [];
    environment.reports.forEach(rpt => {
      let tempCard: ReportCard;
      let rcdCnt;
      if (rpt.url) {
        rcdCnt = this.getReportCount(rpt);
        tempCard = {
          title: rpt.title,
          subTitle: rpt.subtitle,
          recordCount: rcdCnt
        }
      } else {
        tempCard = {
          title: rpt.title,
          subTitle: '',
          recordCount: rcdCnt
        }
      }
      reportArray.push(tempCard);
    })
    this.cardInfo = reportArray;
  }

  getReportCount(rpt: any): Observable<number> {
    let retCnt: number;
    let newPage = new Page(rpt.defaultSortField, rpt.defaultSortDirection)
    return this.dataService.getReportCount(rpt.url, newPage).pipe(
      map(cnt => {
        return cnt
      })
    )
  }

  highlightCard(id: number, evt: MouseEvent) {
    let reportURL = this.reports[id].url;
    if (reportURL) {
      this.router.navigateByUrl(reportURL);
    }
    if (this.cardHighlighted) {
      document.getElementById(this.highlightedCard).classList.remove('cardHighlight');
      document.getElementById(this.highlightedCard).classList.add('card');
    }
    document.getElementById('Report' + id).classList.remove('card');
    document.getElementById('Report' + id).classList.add('cardHighlight');
    this.cardHighlighted = true;
    this.highlightedCard = 'Report' + id;
    let rptComponent = null;
    //Add new reports to this case statement so the component can be instiated when the pane is clicked
    //Next step would be to instantiate a component from a string so this does not have to be maintained.
    switch(reportURL) {
      case '/report/agreement': {
        rptComponent = AgreementReportComponent;
        break;
      }
      case '/report/pickup': {
        rptComponent = PickupReportComponent;
        break;
      }
      case '/report/segment': {
        rptComponent = SegmentReportComponent;
        break;
      }
      case '/report/sign': {
        rptComponent = SignReportComponent;
        break;
      }
      case '/report/agreements-by-renewal-date': {
        rptComponent = AgreementsByRenewalReportComponent;
        break;
      }
      case '/report/group-type-info': {
        rptComponent = GroupTypeInfoReportComponent;
        break;
      }
      case '/report/group': {
        rptComponent = GroupReportComponent;
        break;
      }
      default: {
        rptComponent = DefaultReportComponent;
        this.router.navigate(['/report']);
        break;
      }
    }
    const rpt = new Report(rptComponent, this.reports[id].title)
    this.reportingComponent.setReport(rpt);
  }

}
