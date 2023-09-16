import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseDataComponent } from 'src/app/common/components/base-data.component';
import { GroupReport } from 'src/app/reporting/reports/models/report-models/group-report-interface';
import { DataService } from 'src/app/common/services/data.service';
import { Page } from 'src/app/common/models/page';
import { Subscription } from 'rxjs';
import { DataFilterService } from 'src/app/common/services/data-filter.service';

@Component({
  selector: 'group-report',
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
export class GroupReportComponent
  extends BaseDataComponent
  implements OnInit, OnDestroy {
  constructor(
    public dataService: DataService,
    public dataFilter: DataFilterService,
  ) {
    super(dataService, dataFilter);
    console.warn(`--------------- Calling Group Report constructor`);
  }
  filterSubscriptions: Subscription[];
  reportData: GroupReport[];
  currentPage: Page<GroupReport>;
  ngOnInit() {
    let sortValues = this.getDefaultSortValues();
    let sortField;
    let sortDirection;
    if (sortValues) {
      sortField = sortValues[0];
      sortDirection = sortValues[1];
    } else {
      console.log(`GroupReportComponent:ngOninit error: Tried to retrieve default sort values from environment file but did not find any`)
    }
    this.currentPage = new Page<GroupReport>(sortField, sortDirection);
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
        name: 'Maintenance Office',
        dataKey: 'maintenanceOfficeName',
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
        name: 'Agreement Start Date',
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
        name: 'Group ID',
        dataKey: 'groupId',
        position: 'right',
        isSortable: true,
      },
      {
        name: 'Group Type',
        dataKey: 'groupType',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Primary Contact Name',
        dataKey: 'primaryContactName',
        position: 'left',
        isSortable: false,
      },
      {
        name: 'Primary Contact Address',
        dataKey: 'primaryContactAddress',
        position: 'left',
        isSortable: false,
      },
      {
        name: 'Primary Contact City',
        dataKey: 'primaryContactCity',
        position: 'left',
        isSortable: false,
      },
      {
        name: 'Primary Contact Zip',
        dataKey: 'primaryContactPostalCode',
        position: 'right',
        isSortable: false,
      },
      {
        name: 'Primary Contact Phone',
        dataKey: 'primaryContactPhone',
        position: 'left',
        isSortable: false,
      },
      {
        name: 'Primary Contact Email',
        dataKey: 'primaryContactEmail',
        position: 'left',
        isSortable: false,
      },
      {
        name: 'Secondary Contact Name',
        dataKey: 'secondaryContactName',
        position: 'left',
        isSortable: false,
      },
      {
        name: 'Secondary Contact Address',
        dataKey: 'secondaryContactAddress',
        position: 'left',
        isSortable: false,
      },
      {
        name: 'Secondary Contact City',
        dataKey: 'secondaryContactCity',
        position: 'left',
        isSortable: false,
      },
      {
        name: 'Secondary Contact Zip',
        dataKey: 'secondaryContactPostalCode',
        position: 'right',
        isSortable: false,
      },
      {
        name: 'Secondary Contact Phone',
        dataKey: 'secondaryContactPhone',
        position: 'left',
        isSortable: false,
      },
      {
        name: 'Secondary Contact Email',
        dataKey: 'secondaryContactEmail',
        position: 'left',
        isSortable: false,
      },
      {
        name: 'Segment Length (miles)',
        dataKey: 'segmentLength',
        position: 'right',
        isSortable: true,
      },
      {
        name: 'Sign Installed',
        dataKey: 'isSignInstalled',
        position: 'left',
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
