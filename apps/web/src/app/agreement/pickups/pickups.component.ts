import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { Pickups } from '../models/pickups';
import { PickupService } from 'src/app/agreement/services/pickup.service';
import { RoleType } from 'src/app/auth/_models';
import { AuthenticationService } from 'src/app/auth/_services';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddPickupComponent } from '../add-pickup/add-pickup.component';
import { MatSort, Sort } from '@angular/material/sort';
import { PickupFields } from '../models/pickupFields';
@Component({
  selector: 'app-pickups',
  templateUrl: './pickups.component.html',
  styleUrls: ['./pickups.component.css'],
})
export class PickupsComponent implements OnInit {
  pickupDetails: MatTableDataSource<Pickups>;
  displayedColumns: string[] = [
    'Pickup Date',
    'Pickup Type',
    'Bags Collected',
    'Volunteer Count',
    'Comments',
  ];
  roleTypes = RoleType;
  public authRoleType: string;
  page = 1;
  rowLimit = 10;
  orderBy = 'pickupDate';
  orderByDirection = 'DESC';

  @ViewChild('pickupsTbSort') pickupsTbSort = new MatSort();

  @Input() agreementId = '';
  @Input() isPageable = false;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() rowActionIcon: string;
  @Input() paginationSizes = environment.paginationSizes;
  @Input() defaultPageSize = environment.defaultPageSize;

  @Output() pgEvent: EventEmitter<PageEvent> = new EventEmitter();
  @Output() sort: EventEmitter<Sort> = new EventEmitter();

  @Input() showFirstLastButtons = environment.showFirstLastButtons;
  constructor(
    public pickupService: PickupService,
    private authService: AuthenticationService,
    public addPickupDialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.authRoleType = this.authService.getSelectedRoleType();
    this.pickupDetails = new MatTableDataSource([]);
    this.refresh();
  }

  ngAfterViewInit() {
    this.pickupDetails.sort = this.pickupsTbSort;
  }

  refresh() {
    this.pickupService
      .getPickupsforAgreement(
        this.agreementId,
        this.page,
        this.rowLimit,
        this.orderBy,
        this.orderByDirection,
      )
      .subscribe(
        (resp) => {
          this.pickupDetails = resp['items'];
        },
        (error) => {
          console.error(error);
          this.pickupDetails = new MatTableDataSource([]);
        },
      );
  }

  onPaginate(event: PageEvent) {
    this.pgEvent.emit(event);
  }

  openAddPickup() {
    const addPickupDialogConfig = new MatDialogConfig();

    addPickupDialogConfig.disableClose = true;
    addPickupDialogConfig.autoFocus = true;

    const dialogRef = this.addPickupDialog.open(AddPickupComponent, {
      data: {
        agreementId: this.agreementId,
      },
      width: '80vw',
      maxWidth: '1000px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.refresh();
    });
  }

  openEditPickup(row) {
    console.log(row);
    const editPickupDialogConfig = new MatDialogConfig();

    editPickupDialogConfig.disableClose = true;
    editPickupDialogConfig.autoFocus = true;

    const dialogRef = this.addPickupDialog.open(AddPickupComponent, {
      data: {
        agreementId: this.agreementId,
        props: row,
      },
      width: '80vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.refresh();
    });
  }

  sortData(evt) {
    console.log(evt);
    evt.direction ? null : (evt.direction = 'DESC');
    let sortField: string;
    console.log('selected field: ', evt.active);
    for (const enumMember in PickupFields) {
      console.log('enum member: ', enumMember);
      console.log('enum value: ', PickupFields[enumMember]);
      if (PickupFields[enumMember] === evt.active) {
        sortField = enumMember;
      }
    }
    this.pickupService
      .getPickupsforAgreement(
        this.agreementId,
        this.page,
        this.rowLimit,
        sortField,
        evt.direction.toUpperCase(),
      )
      .subscribe((resp) => {
        this.pickupDetails = resp['items'];
      });
  }
}
