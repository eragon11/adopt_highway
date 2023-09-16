/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WIP - CURRENTLY NOT UTILIZED IN THE APPLICATION - AH-596 refactored this code and removed the dependency for the
// USER listing page

// TODO: If needed for other elements of the app, and can be truly modular reuse, otherwise deem it deprecated and delete
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import {
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'card-report-table',
  templateUrl: './card-report-table.component.html',
  styleUrls: ['./card-report-table.component.css'],
})

// The CardReportTableComponent is the re-useable template for card based reports such as the user listing.
// The Inputs are taken from the parent component to setup things like the data arrays, pagination etc.
export class CardReportTableComponent {
  constructor(private router: Router) {}

  public tableDataSource: Array<any>;
  public isDataReturned = true;
  clientFilterSubscription: Subscription;
  filter: string;

  @ViewChild(MatPaginator, { static: false }) matPaginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort: MatSort;

  // This property needs to have a setter, to dynamically get changes from parent component
  // The code is called when the data is set to the variable in the parent component
  @Input() set tableData(data: any[]) {
    if (data) {
      this.isDataReturned = data.length > 0 ? true : false;

      // Adds an attribute for color which is used by the template
      data = this.setColors(data);
      this.setTableDataSource(data);
    }
  }
  @Input() isPageable = false;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() paginationSizes: number[];
  @Input() defaultPageSize: number;
  @Input() defaultUsersPageSize: number;
  @Input() length: number;
  @Input() indexOfExportColumn: number[] = [];
  //this is not needed yet
  // @Output() rowAction: EventEmitter<any> = new EventEmitter();
  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  @Output() pgEvent: EventEmitter<PageEvent> = new EventEmitter();

  // TODO: generate colors based off AAH color palette
  setColors(data: Array<any>): Array<any> {
    if (data) {
      data.forEach((item) => {
        item.color = '#000000'.replace(/0/g, function () {
          return (~~(Math.random() * 16)).toString(16);
        });
      });
    }
    return data;
  }

  //This is not used right now but might be used for pagination
  onPaginate(event: PageEvent) {
    this.pgEvent.emit(event);
  }

  //Sets the MatTableDataSource to the data returned from the api call
  setTableDataSource(data: any) {
    if (data) {
      this.tableDataSource = data;
    }
  }

  navigateToRecord(data, event) {
    this.router.navigate(['./users/' + data.id]);
  }
}
