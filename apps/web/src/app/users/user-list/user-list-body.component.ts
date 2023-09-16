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
  selector: 'user-list-body',
  templateUrl: './user-list-body.component.html',
  styleUrls: ['./user-list-body.component.css'],
})
export class UserListBodyComponent {
  constructor(private router: Router) {}

  public tableDataSource: Array<any>;
  public isDataReturned = true;

  clientFilterSubscription: Subscription;

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
  @Input() isPageable = true;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() paginationSizes: number[];
  @Input() defaultPageSize: number;
  @Input() defaultUsersPageSize: number;
  @Input() length: number;
  @Input() indexOfExportColumn: number[] = [];

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

  onPaginate(event: PageEvent) {
    this.pgEvent.emit(event);
  }

  //Sets the MatTableDataSource to the data returned from the api call
  setTableDataSource(data: any) {
    if (data) {
      data.forEach((user, index, array) => {
        if (user.roles.length > 1) {
          // only include the admin as a role when listing
          user.roles.forEach((obj, index, array) => {
            if (obj.type === 'Administrator') {
              user.roles = user.roles.filter(function(el) { return el.type === "Administrator"; });
            }
          });
        }
      });
      this.tableDataSource = data;
    }
  }

  navigateToRecord(data, event) {
    this.router.navigate(['./users/' + data.id]);
  }
}
