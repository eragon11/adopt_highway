import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseDataComponent } from 'src/app/common/components/base-data.component';
import { PickupReport } from 'src/app/reporting/reports/models/report-models/pickups-report-interface';
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
export class PickupReportComponent
  extends BaseDataComponent
  implements OnInit, OnDestroy {
  constructor(
    public dataService: DataService,
    public dataFilter: DataFilterService,
  ) {
    super(dataService, dataFilter);
    console.warn(`--------------- Calling pickupreport constructor`);
  }
  filterSubscriptions: Subscription[];
  reportData: PickupReport[];
  currentPage: Page<PickupReport>;

  ngOnInit() {
    console.warn(`--------------- Calling pickupreport OnInit`);

    const sortValues = this.getDefaultSortValues();
    let sortField;
    let sortDirection;
    if (sortValues) {
      sortField = sortValues[0];
      sortDirection = sortValues[1];
    } else {
      console.log(
        `PickupReportComponent:ngOninit error: Tried to retrieve default sort values from environment file but did not find any`,
      );
    }
    this.currentPage = new Page<PickupReport>(sortField, sortDirection);
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
        name: 'Pickup ID',
        dataKey: 'pickupId',
        position: 'right',
        isSortable: true,
      },
      {
        name: 'Last Pickup Date',
        dataKey: 'lastPickupDate',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Next Pickup Date',
        dataKey: 'nextPickupDate',
        position: 'left',
        isSortable: false,
      },
      {
        name: 'Renewal Date',
        dataKey: 'renewalDate',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Qty Missed Pickups',
        dataKey: 'numberOfMissedPickups',
        position: 'right',
        isSortable: false,
      },
      {
        name: 'Qty Pickups Completed',
        dataKey: 'numberOfPickupsCompleted',
        position: 'right',
        isSortable: true,
      },
      {
        name: 'Group ID',
        dataKey: 'groupId',
        position: 'right',
        isSortable: true,
      },
      {
        name: 'Route Name',
        dataKey: 'routeName',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Pickup Type',
        dataKey: 'pickupType',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Bag Qty/Group',
        dataKey: 'bagQuantityPerGroup',
        position: 'right',
        isSortable: true,
      },
      {
        name: 'Volume Quantity',
        dataKey: 'volumeQuantity',
        position: 'right',
        isSortable: true,
      },
      {
        name: 'Number of Volunteers',
        dataKey: 'volunteerCount',
        position: 'right',
        isSortable: true,
      },
      {
        name: 'Agreement Start Date',
        dataKey: 'agreementStartDate',
        position: 'left',
        isSortable: true,
      },
      {
        name: 'Number of Miles',
        dataKey: 'numberOfMiles',
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
