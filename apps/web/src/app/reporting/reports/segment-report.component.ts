import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseDataComponent } from 'src/app/common/components/base-data.component';
import { SegmentReport } from 'src/app/reporting/reports/models/report-models/segment-report-interface';
import { DataService } from 'src/app/common/services/data.service';
import { Page } from 'src/app/common/models/page';
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
export class SegmentReportComponent
  extends BaseDataComponent
  implements OnInit, OnDestroy {
  constructor(
    public dataService: DataService,
    public dataFilter: DataFilterService,
  ) {
    super(dataService, dataFilter);
  }
  filterSubscriptions: Subscription[];
  dateFilterSubscription: Subscription;
  reportData: SegmentReport[];
  currentPage: Page<SegmentReport>;
  ngOnInit() {
    let sortValues = this.getDefaultSortValues();
    let sortField;
    let sortDirection;
    if (sortValues) {
      sortField = sortValues[0];
      sortDirection = sortValues[1];
    } else {
      console.log(
        `SegmentReportComponent:ngOninit error: Tried to retrieve default sort values from environment file but did not find any`,
      );
    }

    this.currentPage = new Page<SegmentReport>(sortField, sortDirection);
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
        dataKey: 'districtName',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'County',
        dataKey: 'countyName',
        position: 'left',
        isSortable: true,
      },

      {
        name: 'Maint. Office',
        dataKey: 'maintenanceOfficeName',
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
        name: 'Agreement Status',
        dataKey: 'agreementStatus',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Agreement Start',
        dataKey: 'agreementStartDate',
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
        name: 'Segment From LAT',
        dataKey: 'segmentFromLat',
        position: 'right',
        isSortable: true,
      },
      {
        name: 'Segment From LONG',
        dataKey: 'segmentFromLong',
        position: 'right',
        isSortable: true,
      },
      {
        name: 'Segment To LAT',
        dataKey: 'segmentToLat',
        position: 'right',
        isSortable: true,
      },
      {
        name: 'Segment To LONG',
        dataKey: 'segmentToLong',
        position: 'right',
        isSortable: true,
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
