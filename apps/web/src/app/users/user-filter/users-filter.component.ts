import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, Subscription, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { District } from 'src/app/common/models/district';
import { MaintOffice } from 'src/app/common/models/maintOffice';
import { AuthenticationService } from 'src/app/auth/_services';
import { RoleType } from 'src/app/auth/_models/role-type';
import { AreaDataService } from 'src/app/common/services/area-data.service';
import { UsersFilterService } from '../services/users-filter.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UsersAddComponent } from '../users-add/users-add.component';
import { UsersDataService } from '../services/users-data.service';
import { UserRoleTypeFilter } from '../models/user-role-type-filter';

@Component({
  selector: 'users-filter',
  templateUrl: './users-filter.component.html',
  styleUrls: ['./users-filter.component.css'],
})

// The UsersFilterComponent is used to render the filters in the header. This component also
// has the code behind the filters i.e. the population of the filters (with type ahead) and the actions
// to take once the user chooses a filter or when the user blanks out the filter input field
export class UsersFilterComponent implements OnInit  {
  private subscr: Subscription;

  typeFilter = new UserRoleTypeFilter();

  userFilterForm = new FormGroup({
    districtForm: new FormControl(),
    maintOfficeForm: new FormControl(
      { value: '', disabled: false },
      Validators.required,
    ),
    filterUserName: new FormControl(),
    filterByRoleType: new FormControl(),
  });

  constructor(
    public areaDataService: AreaDataService,
    public userFilterService: UsersFilterService,
    private authService: AuthenticationService,
    public addUserDialog: MatDialog,
    public usersDataService: UsersDataService,
  ) {

    this.subscr = this.userFilterForm
      .get('districtForm')
      .valueChanges.subscribe(() => {
        if (this.userFilterForm.controls['districtForm'].value === '') {
          // TODO: Add more nuanced logic for enabling/disabling the MO input -
          // i.e. only enable when user has selected a District
          this.userFilterForm.controls['maintOfficeForm'].disable();
          this.isDistrictEmpty = true;
          this.districtInputEmpty();
        } else {
          this.userFilterForm.controls['maintOfficeForm'].enable();
          this.isDistrictEmpty = false;
        }
      });
  }

  public authRoleType: string;
  public districtsTemplateArray: Observable<Array<District>>;
  public districtsFilteringArray: Observable<Array<District>>;
  public maintOfficesTemplateArray: Observable<Array<MaintOffice>>;
  public maintOfficesFilteringArray: Observable<Array<MaintOffice>>;

  //Used to keep track of the template state of the filters
  private districtFilter: string;
  private maintOfficeFilter: string;
  public isDistrictEmpty: boolean;
  public userSearchFilter: string = null;

  public selectedRoleTypes: any[];

  //used to open the selection panels
  @ViewChild('maintOfcTrigger', { read: MatAutocompleteTrigger })
  maintOfcAutocomplete: MatAutocompleteTrigger;


  ngOnInit(): void {
    //the <area>FilteringArray arrays are used for filtering. the arrays with the TemplateArray appended are bound to the template
    //We need to populate the district array with the full list so the user can filter on them
    //The maint office array is empty until the users chooses a district, then it will be populated
    this.authRoleType = this.authService.getSelectedRoleType();
    switch (this.authRoleType) {
      case RoleType.ReadOnlyUser:
      case RoleType.Administrator: {
        this.userFilterForm.controls['maintOfficeForm'].disable();
        this.districtsFilteringArray = this.areaDataService.getDistricts();
        this.districtsTemplateArray = this.setAreaFilterFormValueChangesEvent(
          'districtForm',
          this.districtsFilteringArray,
        );
        this.maintOfficesFilteringArray = of([]);
        this.maintOfficesTemplateArray = this.setAreaFilterFormValueChangesEvent(
          'maintOfficeForm',
          this.maintOfficesFilteringArray,
        );
        break;
      }
      case RoleType.District: {
        const districtNum = this.authService.getDistrictNumber().toString();
        this.isDistrictEmpty = false;
        this.districtSelectEvent(districtNum);
        this.maintOfficesFilteringArray = of([]);
        this.maintOfficesTemplateArray = this.setAreaFilterFormValueChangesEvent(
          'maintOfficeForm',
          this.maintOfficesFilteringArray,
        );
        break;
      }
      case RoleType.Maintenance: {
        const districtNum = this.authService.getDistrictNumber().toString();
        this.districtFilter = districtNum;
        const maintOfc = this.authService.getMaintOfficeNum().toString();
        this.maintSelectEvent(maintOfc);
        break;
      }
    }
  }

  ngOnDestroy() {
    this.subscr.unsubscribe();
  }

  // ------ District / Maintenance Section Filters  ----- //
  setAreaFilterFormValueChangesEvent(
    formControlName: string,
    filterArray: Observable<any>,
  ): Observable<any> {
    return this.userFilterForm.controls[formControlName].valueChanges.pipe(
      startWith(''),
      switchMap((val) => {
        return this.areaAutoComplete(val, formControlName, filterArray);
      }),
    );
  }

  areaAutoComplete(
    value: string,
    formControlName: string,
    array: Observable<any>,
  ): Observable<any> {
    return array.pipe(
      map((response) =>
        response.filter((option) => {
          return option.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
        }),
      ),
    );
  }

  setDistrictInputs(district: string): void {
    //need to set district values locally for the template and in the service for them to match
    this.districtFilter = district;
    this.userFilterService.setDistrict(district);
  }

  districtSelectEvent($event: any) {
    const districtSelected = $event;
    this.areaDataService.getMaintOffices(districtSelected).subscribe((data) => {
      //need to clear out the inputs for maint office. The selection arrays will be repopulated
      this.userFilterForm.controls['maintOfficeForm'].setValue('');
      //set the district selected locally (template) and in the service
      this.setDistrictInputs(districtSelected);
      this.maintOfficesFilteringArray = of(data);

      //have to reestablish the filtering since, apparently, populating the array with data breaks the valuechanges event watcher
      this.maintOfficesTemplateArray = this.setAreaFilterFormValueChangesEvent(
        'maintOfficeForm',
        this.maintOfficesFilteringArray,
      );
    });
  }

  setMaintOfficeInputs(maintOffice: string): void {
    //need to set district values locally for the template and in the service for them to match
    this.maintOfficeFilter = maintOffice;
    if (this.districtFilter) {
      this.userFilterService.setMaintOffice(this.districtFilter, maintOffice);
    } else {
      console.error(
        `UserFilterComponent:setMaintOffice: Error: A Maintenance Office filter was selected however a district has not been set locally`,
      );
    }
  }

  maintSelectEvent($event: any) {
    const selectedOption = $event;
    if (this.districtFilter) {
      this.areaDataService
        .getCounties(this.districtFilter, selectedOption)
        .subscribe((data) => {
          //set the maint office selected locally (template) and in the service
          this.setMaintOfficeInputs(selectedOption);
        });
    } else {
      console.error(
        `HeaderComponent:maintSelectEvent: Error: A Maintenance Office filter was selected however a district has not been chosen`,
      );
    }
  }

  districtInputEmpty() {
    this.userFilterService.clearAreaFilters();
  }

  watchMaintInput() {
    if (this.userFilterForm.controls['maintOfficeForm'].value === '') {
      console.error('this.districtFilter: ', this.districtFilter);
      this.userFilterService.resetToDistrictFilter(this.districtFilter);
    }
  }

  // ----------   End area filters ---------------------------//


  showAddUser() {
    const addUserDialogConfig = new MatDialogConfig();

    addUserDialogConfig.disableClose = true;
    addUserDialogConfig.autoFocus = true;

    const dialogRef = this.addUserDialog.open(UsersAddComponent, {
      data: {
        districts: this.districtsTemplateArray,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'success') {
        this.userFilterForm.get('districtForm').setValue('');
        this.userFilterForm.get('filterUserName').setValue('');
        this.searchUser('');
      }
    });
  }

  searchUser(event) {
    this.userFilterService.setSearchStr(event);
  }

  searchByRole(event) {
    const selectedRoleTypes = event.value.map(element => element.query);
    this.userFilterService.setUserRoles(selectedRoleTypes);
  }

  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.id === objTwo.id;
    }
  }

  selectAllRoles(select, values, selectedRoleTypes) {
    const flattenValues = [];
    const flattenQueries = [];
    values.forEach((element, index, array) => {
      element.type.forEach((e, i, a) => {
        flattenValues.push( e);
        flattenQueries.push( e.query);
      });
    });
    select.value = flattenValues;
    selectedRoleTypes = flattenValues;
    this.userFilterService.setUserRoles(flattenQueries);
  }

  deselectAllRoles(select) {
    this.selectedRoleTypes = [];
    select.value = [];
    this.userFilterService.clearUserRoles();
  }
}
