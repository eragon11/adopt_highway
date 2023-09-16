import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseDataComponent } from 'src/app/common/components/base-data.component';
import { DataService } from 'src/app/common/services/data.service';
import { Page } from 'src/app/common/models/page';
import { AgreementReport } from 'src/app/reporting/reports/models/report-models/agreement-report-interface';
import { Subscription } from 'rxjs';
import { DataFilterService } from 'src/app/common/services/data-filter.service';

@Component({
  selector: 'pickup-report',
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
export class AgreementReportComponent
  extends BaseDataComponent
  implements OnInit, OnDestroy {
  constructor(
    public dataService: DataService,
    public dataFilter: DataFilterService,
  ) {
    super(dataService, dataFilter);
    console.warn(`--------------- Calling Agreement Report constructor`);
  }
  filterSubscriptions: Subscription[];
  dateFilterSubscription: Subscription;
  reportData: AgreementReport[];
  currentPage: Page<AgreementReport>;
  ngOnInit() {
    let sortValues = this.getDefaultSortValues();
    let sortField;
    let sortDirection;
    if (sortValues) {
      sortField = sortValues[0];
      sortDirection = sortValues[1];
    } else {
      console.log(
        `AgreementReportComponent:ngOninit error: Tried to retrieve default sort values from environment file but did not find any`,
      );
    }

    this.currentPage = new Page<AgreementReport>(sortField, sortDirection);
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
        name: 'Maint Office',
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
        name: 'Agreement ID',
        dataKey: 'agreementId',
        position: 'right',
        isSortable: true,
      },
      {
        name: 'Agreement Status',
        dataKey: 'agreementStatus',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Agreement Begin',
        dataKey: 'agreementBeginDate',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Agreement End',
        dataKey: 'agreementEndDate',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Segment ID',
        dataKey: 'segmentId',
        position: 'right',
        isSortable: true,
      },
      {
        name: 'Segment Status',
        dataKey: 'segmentStatus',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Route Name',
        dataKey: 'routeName',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Sign Name',
        dataKey: 'signText',
        position: 'left',
        isSortable: true,
      },
      //This last stanza must be in the configuration in order to support exporting
      //could have the innerHTML in the stanza instead of just turning it on. Although,
      //then it would have to be repeated in each report config instead of once in the HTML
      {
        name: 'Export',
        dataKey: '',
        position: 'right',
        isSortable: false,
        isControl: true,
      },
    ];
  }
}
