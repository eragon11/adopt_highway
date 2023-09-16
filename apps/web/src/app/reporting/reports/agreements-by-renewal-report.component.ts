import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BaseDataComponent } from 'src/app/common/components/base-data.component';
import { AgreementsByRenewalReport } from 'src/app/reporting/reports/models/report-models/agreements-by-renewal-report';
import { DataService } from 'src/app/common/services/data.service';
import { Page } from 'src/app/common/models/page';
import { Subscription } from 'rxjs';
import { DataFilterService } from 'src/app/common/services/data-filter.service';

@Component({
  selector: 'agreements-by-renewal-report',
  template: `
    <report-table
      [tableData]="reportData"
      [tableColumns]="reportTableColumns"
      [isFilterable]="false"
      [isPageable]="pageable"
      (pgEvent)="receivePageEvent($event)"
      [length]="length"
      [paginationSizes]="pageSizeOptions"
      (sort)="sortData($event)"
    >
    </report-table>
  `,
  styles: [],
})

//This is a high level report. This component is used to provide a type/model to the data returned from the API.
//It is also used to define/configure the fields used in the report. It extends the BaseDataComponent which
//contains the majority of methods that are used by all of the reports.
//With regard to the template, it is the child of the ReportTableComponent which is responsible for rendering
//the report. This child template is used to provide the data and the table configurations to the parent template
export class AgreementsByRenewalReportComponent
  extends BaseDataComponent
  implements OnInit, OnDestroy {
  constructor(
    public dataService: DataService,
    public dataFilter: DataFilterService,
  ) {
    super(dataService, dataFilter);
    console.warn(
      `--------------- Calling AgreementsByRenewalReport constructor`,
    );
  }
  filterSubscriptions: Subscription[];
  reportData: AgreementsByRenewalReport[];
  currentPage: Page<AgreementsByRenewalReport>;

  ngOnInit() {
    console.warn(`--------------- Calling AgreementsByRenewalReport OnInit`);

    let sortValues = this.getDefaultSortValues();
    let sortField;
    let sortDirection;
    if (sortValues) {
      sortField = sortValues[0];
      sortDirection = sortValues[1];
    } else {
      console.log(
        `AgreementsByRenewalReportComponent:ngOninit error: Tried to retrieve default sort values from environment file but did not find any`,
      );
    }
    this.currentPage = new Page<AgreementsByRenewalReport>(
      sortField,
      sortDirection,
    );
    this.initializeColumns();
    this.filterSubscriptions = this.setDataFilter();
  }

  ngOnDestroy() {
    this.filterSubscriptions.forEach((rpt) => {
      rpt.unsubscribe();
    });
  }

  initializeColumns(): void {
    this.reportTableColumns = [
      {
        name: 'renewalTimeFrame',
        dataKey: 'renewalTimeFrame',
        position: 'left',
        isSortable: false,
        isGroupBy: true,
      },
      {
        name: 'District',
        dataKey: 'district',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'County',
        dataKey: 'county',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Maintenance Office',
        dataKey: 'maintenanceOffice',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Group Name',
        dataKey: 'groupName',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Group ID',
        dataKey: 'groupId',
        position: 'right',
        isSortable: true,
      },
      {
        name: 'Agreement Id',
        dataKey: 'agreementId',
        position: 'right',
        isSortable: true,
      },
      {
        name: 'Agreement Info',
        dataKey: 'agreementInfo',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Agreement Begin Date',
        dataKey: 'agreementStartDate',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Agreement End Date',
        dataKey: 'agreementEndDate',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Pickups / Agreement Timeframe',
        dataKey: 'totalNumberOfPickupsPerAgreementTimeline',
        position: 'right',
        isSortable: true,
      },
      {
        name: '# Missed Pickups',
        dataKey: 'numberOfMissedPickups',
        position: 'right',
        isSortable: false,
      },
      //This last stanza must be in the configuration in order to support exporting
      {
        name: 'Export',
        dataKey: '',
        position: 'left',
        isSortable: false,
        isControl: true,
      },
    ];
  }
}
