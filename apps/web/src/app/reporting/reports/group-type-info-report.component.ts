/* eslint-disable prettier/prettier */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseDataComponent } from 'src/app/common/components/base-data.component';
import { DataService } from 'src/app/common/services/data.service';
import { Page } from 'src/app/common/models/page';
import { GroupTypeInfoReport } from 'src/app/reporting/reports/models/report-models/group-type-info-report-interface';
import { DataFilterService } from 'src/app/common/services/data-filter.service';

@Component({
  selector: 'sign-report',
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
export class GroupTypeInfoReportComponent extends BaseDataComponent implements OnInit {
  constructor (
    public dataService: DataService,
    public dataFilter: DataFilterService,
    ) {
    super(dataService, dataFilter)
    console.warn(`--------------- Calling groupTypeInfo report constructor`)
  }
  reportData: GroupTypeInfoReport[];
  currentPage: Page<GroupTypeInfoReport>;
  ngOnInit() {
    const sortValues = this.getDefaultSortValues();
    const sortField = sortValues[0];
    const sortDirection = sortValues[1];
    this.currentPage = new Page<GroupTypeInfoReport>(sortField, sortDirection);
    this.loadData(this.currentPage);
    this.initializeColumns();
  }

  initializeColumns(): void {
    this.reportTableColumns = [
      {
        name: 'Group Type',
        dataKey: 'type',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Total Count',
        dataKey: 'countOfType',
        position: 'right',
        isSortable: false,
      },
      {
        name: 'Percent of Total',
        dataKey: 'percentageOfType',
        position: 'right',
        isSortable: false,
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
