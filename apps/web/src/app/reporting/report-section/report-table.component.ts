import { Component, OnInit, ViewChild, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableColumn } from 'src/app/reporting/reports/models/TableColumn';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { ClientFilterService } from '../services/client-filter.service';

export enum ExportType {
  XLS = 'xls',
  XLSX = 'xlsx',
  CSV = 'csv',
  TXT = 'txt',
  JSON = 'json'
}
@Component({
  selector: 'report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.css'],
})
export class ReportTableComponent {
  env = environment;
  tempArray: Array<object> = [];

  public tableDataSource: MatTableDataSource<any>;
  public displayedColumns: string[];
  @ViewChild(MatPaginator, { static: false }) matPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort: MatSort;

  @Input() isPageable = false;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() tableColumns: TableColumn[];
  @Input() rowActionIcon: string;
  @Input() paginationSizes: number[];
  @Input() defaultPageSize: number;
  @Input() length: number;
  @Input() showFirstLastButtons = environment.showFirstLastButtons;
  @Input() hasGroupBy: boolean = false;
  @Input() indexOfExportColumn: number[] = [];

  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  //this is not needed yet
  // @Output() rowAction: EventEmitter<any> = new EventEmitter();
  @Output() pgEvent: EventEmitter<PageEvent> = new EventEmitter();

  // this property needs to have a setter, to dynamically get changes from parent component
  @Input() set tableData(data: any[]) {
    if (this.hasGroupBy) {
      let demarkVal: string = 'none'
      let newArray: any[] = []
      data.forEach((row, index)  =>{
        let groupVal = row[this.groupByColumn];

        if (groupVal != demarkVal) {
          let textToShow = ''
          environment.reportGroupHeadings.forEach(val => {
            if (groupVal === val.value) {
              textToShow = val.text ? val.text : groupVal ;
            }
          })

          newArray.push({value: textToShow, isGroupBy: true});
          demarkVal = groupVal;
        }
        newArray.push(row)
      })
      this.setTableDataSource(newArray);
    } else {
      this.setTableDataSource(data);
    }
  }
  dateFilterSubscription: Subscription;
  clientFilterSubscription: Subscription;
  exportOverlayOpen: boolean = false;
  groupByColumn: string = null;
  currentGroupByValue: string = null;
  filter: string;

  constructor(private clientFilter: ClientFilterService) {}

  ngOnInit(): void {
    // const columnNames:string [] = this.tableColumns.map((tableColumn: TableColumn) => tableColumn.name);
    const columnNames:string [] = [];
    let controlIndexes: number[] = [];
    this.tableColumns.forEach((currentValue, index) => {
      if (currentValue.isControl) {
        controlIndexes.push(index)
        columnNames.push(currentValue.name)
      } else if (currentValue.isGroupBy) {
        this.groupByColumn = currentValue.dataKey;
        this.hasGroupBy = true;
      } else {
        columnNames.push(currentValue.name)
      }
      this.indexOfExportColumn = controlIndexes;
    });

    if (this.rowActionIcon) {
      this.displayedColumns = [this.rowActionIcon, ...columnNames];
    } else {
      this.displayedColumns = columnNames;
    }
    this.clientFilterSubscription = this.clientFilter
      .getFilterSubj()
      .subscribe((toggle) => {
        this.isFilterable = toggle;
      });
  }

  filterControl($event) {
    this.isFilterable = !this.isFilterable;
    if (!this.isFilterable) {
      this.tableDataSource.filter = '';
      this.filter = '';
    }
  }

  isGroup(index, item): boolean{
    return item.isGroupBy;
  }

  onPaginate(event: PageEvent) {
    this.pgEvent.emit(event);
  }

  //Sets the MatTableDataSource to the data returned from the api call
  setTableDataSource(data: any) {
    if (data) {
      this.tableDataSource = new MatTableDataSource(data);
      this.tableDataSource.sort = this.matSort;
    }
  }

  //used for client side filtering
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  sortTable(sortParameters: Sort) {
    // defining name of data property, to sort by, instead of column name
    sortParameters.active = this.tableColumns.find(
      (column) => column.name === sortParameters.active,
    ).dataKey;
    this.sort.emit(sortParameters);
  }

  //not needed now as there are no row actions
  // emitRowAction(row: any) {
  //   this.rowAction.emit(row);
  // }
}
