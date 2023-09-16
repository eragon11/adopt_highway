import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { District } from 'src/app/common/models/district';
import { MaintOffice } from 'src/app/common/models/maintOffice';
import { County } from 'src/app/common/models/county';
import { DataFilterService } from 'src/app/common/services/data-filter.service';
import { AuthenticationService } from 'src/app/auth/_services';
import { RoleType } from 'src/app/auth/_models/role-type';
import { AreaDataService } from 'src/app/common/services/area-data.service';

@Component({
  selector: 'area-filter',
  template: `
    <div id="header-right" class="flex-container">
      <form [formGroup]="areaFilterForm" class="filter-form">
        <div class="report-filter-input-container">
          <input
            disableIfNotAuthorized
            resource="areaFilter_District"
            action="update"
            class="filter-input"
            type="text"
            placeholder="Filter by District"
            formControlName="districtForm"
            [matAutocomplete]="districtAuto"
            (change)="districtBlurEvent($event)"
          />
          <mat-autocomplete
            #districtAuto="matAutocomplete"
            (optionSelected)="districtSelectEvent($event.option.id)"
          >
            <!-- need to add an id attribute because the text field gets set to value when user selects an option -->
            <mat-option
              *ngFor="let district of districtsTemplateArray | async"
              [value]="district.name"
              [id]="district.number"
            >
              {{ district.name }}
            </mat-option>
          </mat-autocomplete>
          <input
            disableIfNotAuthorized
            resource="areaFilter_MaintenanceOffice"
            action="update"
            class="filter-input"
            type="text"
            #maintOfcTrigger="matAutocompleteTrigger"
            placeholder="Filter by Maint. Office"
            formControlName="maintOfficeForm"
            [matAutocomplete]="maintOfcAuto"
            (change)="maintOfcBlurEvent($event)"
          />
          <mat-autocomplete
            #maintOfcAuto="matAutocomplete"
            (optionSelected)="maintSelectEvent($event.option.id)"
          >
            <!-- need to add an id attribute because the text field gets set to value when user selects an option -->
            <mat-option
              *ngFor="let office of maintOfficesTemplateArray | async"
              [value]="office.name"
              [id]="office.number"
            >
              {{ office.name }}
            </mat-option>
          </mat-autocomplete>
          <input
            disableIfNotAuthorized
            resource="areaFilter_County"
            action="update"
            class="filter-input"
            type="text"
            #countiesTrigger="matAutocompleteTrigger"
            placeholder="Filter by County"
            formControlName="countiesForm"
            [matAutocomplete]="countyAuto"
            (change)="countyBlurEvent($event)"
          />
          <mat-autocomplete
            #countyAuto="matAutocomplete"
            (optionSelected)="countySelectEvent($event.option.id)"
          >
            <!-- need to add an id attribute because the text field gets set to value when user selects an option -->
            <mat-option
              *ngFor="let county of countiesTemplateArray | async"
              [value]="county.name"
              [id]="county.number"
            >
              {{ county.name }}
            </mat-option>
          </mat-autocomplete>
          <div class="mat-flat-button-button">
            <button
              mat-flat-button
              (click)="clearAreaFilters($event)"
              tabIndex="0"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./header.component.css'],
})
export class AreaFilterComponent implements OnInit {
  areaFilterForm = new FormGroup({
    districtForm: new FormControl(),
    countiesForm: new FormControl(),
    maintOfficeForm: new FormControl(),
  });

  constructor(
    public dataFilter: DataFilterService,
    public areaDataService: AreaDataService,
    private authService: AuthenticationService,
  ) {}

  public districtsTemplateArray: Observable<Array<District>>;
  public districtsFilteringArray: Observable<Array<District>>;
  public maintOfficesTemplateArray: Observable<Array<MaintOffice>>;
  public maintOfficesFilteringArray: Observable<Array<MaintOffice>>;
  public countiesTemplateArray: Observable<Array<County>>;
  public countiesFilteringArray: Observable<Array<County>>;

  //Used to keep track of the template state of the filters
  private districtFilter: string;
  private maintOfcFilter: string;
  private countyFilter: string;

  private roleType: string;

  //used to open the selection panels
  @ViewChild('maintOfcTrigger', { read: MatAutocompleteTrigger })
  maintOfcAutocomplete: MatAutocompleteTrigger;
  @ViewChild('countiesTrigger', { read: MatAutocompleteTrigger })
  countiesAutocomplete: MatAutocompleteTrigger;

  ngOnInit(): void {
    //the <area>FilteringArray arrays are used for filtering. the arrays with the TemplateArray appended are bound to the template
    //We need to populate the district and county arrays with the full list so the user can filter on them individually
    //The maint office array is empty until the users chooses a district, then it will be populated
    this.roleType = this.authService.getSelectedRoleType();
    switch (this.roleType) {
      case RoleType.ReadOnlyUser:
      case RoleType.Administrator: {
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
        this.countiesFilteringArray = this.areaDataService.getCounties();
        break;
      }
      case RoleType.District: {
        let districtNum = this.authService.getDistrictNumber().toString();
        this.districtSelectEvent(districtNum);
        this.maintOfficesFilteringArray = of([]);
        console.error(
          `IN INIT Setting maintOfficesTemplateArray with arra: ${this.maintOfficesFilteringArray}`,
        );

        this.maintOfficesTemplateArray = this.setAreaFilterFormValueChangesEvent(
          'maintOfficeForm',
          this.maintOfficesFilteringArray,
        );
        this.countiesFilteringArray = this.areaDataService.getCounties(
          districtNum,
          null,
        );
        break;
      }
      case RoleType.Maintenance: {
        const districtNum = this.authService.getDistrictNumber().toString();
        this.districtFilter = districtNum;
        // this.districtSelectEvent (districtNum)
        const maintOfc = this.authService.getMaintOfficeNum().toString();
        this.maintSelectEvent(maintOfc);
        this.countiesFilteringArray = this.areaDataService.getCounties(
          districtNum,
          maintOfc,
        );
        break;
      }
    }

    this.countiesTemplateArray = this.setAreaFilterFormValueChangesEvent(
      'countiesForm',
      this.countiesFilteringArray,
    );
  }

  districtBlurEvent($event) {
    if (this.areaFilterForm.controls['districtForm'].value.length === 0) {
      this.clearAreaFilters();
    }
  }

  maintOfcBlurEvent($event) {
    // If a user clears out the MO, we want to keep the District populated in case they want to simply change
    // MO's. The "Clear All" button can be used for a quick clearing of all element if needed.
  }
  countyBlurEvent($event) {
    if (this.areaFilterForm.controls['countiesForm'].value.length === 0) {
      this.clearAreaFilters();
    }
  }

  //Generic function to place an event watcher on the text input form. When the users types, it filters the results
  setAreaFilterFormValueChangesEvent(
    formControlName: string,
    filterArray: Observable<any>,
  ): Observable<any> {
    return this.areaFilterForm.controls[formControlName].valueChanges.pipe(
      startWith(''),
      // map(value => this._filter(value)),
      switchMap((val) => {
        return this.typeAheadFilter(val, formControlName, filterArray);
      }),
    );
  }

  //Generic function that contains the filtering logic
  typeAheadFilter(
    value: string,
    formControlName: string,
    array: Observable<any>,
  ): Observable<any> {
    return array.pipe(
      map((response) =>
        response.filter((option) => {
          //this was set to === 0 which meant the search string had to be at the beginning
          //of the option string. This did not work for Ft Wortch -> NW Tarrant Co when searching
          //for Tarrant, which would be a natural search so changed to anywhere int he string
          return option.name.toLowerCase().indexOf(value.toLowerCase()) > -1;
        }),
      ),
    );
  }

  private districtReset() {
    this.areaFilterForm.controls['districtForm'].setValue('');
    this.districtFilter = null;
  }

  private maintOfficeReset() {
    this.areaFilterForm.controls['maintOfficeForm'].setValue('');
    if (this.authService.isStateWideRole()) {
      //if admin then we want to clear out the maint office array
      this.maintOfficesTemplateArray = of([]);
    }
    this.maintOfcFilter = null;
  }

  private countiesReset() {
    this.areaFilterForm.controls['countiesForm'].setValue('');
    switch (this.roleType) {
      case RoleType.ReadOnlyUser:
      case RoleType.Administrator: {
        this.countiesFilteringArray = this.areaDataService.getCounties();
        break;
      }
      case RoleType.District: {
        this.countiesFilteringArray = this.areaDataService.getCounties(
          this.districtFilter,
          null,
        );
        break;
      }
    }
    //have to reestablish the filtering since, apparently, populating the array with data breaks the valuechanges event watcher
    this.countiesTemplateArray = this.setAreaFilterFormValueChangesEvent(
      'countiesForm',
      this.countiesFilteringArray,
    );
    this.countyFilter = null;
  }

  clearAreaFilters($event?: any) {
    switch (this.roleType) {
      case RoleType.ReadOnlyUser:
      case RoleType.Administrator: {
        this.districtReset();
        this.maintOfficeReset();
        this.countiesReset();
        break;
      }
      case RoleType.District: {
        this.maintOfficeReset();
        this.countiesReset();
        break;
      }
      case RoleType.Maintenance: {
        this.countiesReset();
      }
    }
    if (this.authService.isStateWideRole()) {
      this.districtReset();
    }
    this.dataFilter.clearAreaFilters();
  }

  setDistrict(district: string): void {
    //need to set district values locally for the template and in the service for them to match
    this.districtFilter = district;
    this.dataFilter.setDistrict(district);
  }

  districtSelectEvent($event: any) {
    const districtSelected = $event;
    this.areaDataService.getMaintOffices(districtSelected).subscribe((data) => {
      //need to clear out the inputs for maint office and county. The selection arrays will be repopulated
      this.areaFilterForm.controls['maintOfficeForm'].setValue('');
      this.areaFilterForm.controls['countiesForm'].setValue('');
      //set the district selected locally (template) and in the service
      this.setDistrict(districtSelected);
      //Open the maint office panel for the user to select and then populated it with the data received
      //unless the disctict is automatically selelcted for the user by their role
      const roles: string[] = [RoleType.Administrator, RoleType.ReadOnlyUser];
      if (roles.includes(this.roleType)) {
        this.maintOfcAutocomplete.openPanel();
      }
      this.maintOfficesFilteringArray = of(data);
      console.error(
        `Setting maintOfficesTemplateArray with arra: ${this.maintOfficesFilteringArray}`,
      );
      //have to reestablish the filtering since, apparently, populating the array with data breaks the valuechanges event watcher
      this.maintOfficesTemplateArray = this.setAreaFilterFormValueChangesEvent(
        'maintOfficeForm',
        this.maintOfficesFilteringArray,
      );
    });
    //when the user selects a district we want to filter the counties as well
    this.areaDataService.getCounties(districtSelected).subscribe((data) => {
      //need to clear out the inputs for county. The selection arrays will be repopulated
      this.areaFilterForm.controls['countiesForm'].setValue('');
      this.countiesFilteringArray = of(data);
      //have to reestablish the filtering since, apparently, populating the array with data breaks the valuechanges event watcher
      this.countiesTemplateArray = this.setAreaFilterFormValueChangesEvent(
        'countiesForm',
        this.countiesFilteringArray,
      );
    });
  }

  setMaintOffice(maintOffice: string): void {
    //need to set district values locally for the template and in the service for them to match
    this.maintOfcFilter = maintOffice;
    if (this.districtFilter) {
      this.dataFilter.setMaintOffice(this.districtFilter, maintOffice);
    } else {
      console.error(
        `HeaderComponent:setMaintOffice: Error: A Maintenance Office filter was selected however a district has not been set locally`,
      );
    }
  }

  maintSelectEvent($event: any) {
    const selectedOption = $event;
    if (this.districtFilter) {
      this.areaDataService
        .getCounties(this.districtFilter, selectedOption)
        .subscribe((data) => {
          //need to clear out the inputs for county. The selection arrays will be repopulated
          this.areaFilterForm.controls['countiesForm'].setValue('');
          //set the maint office selected locally (template) and in the service
          this.setMaintOffice(selectedOption);
          //Open the counties panel for the user to select and then populated it with the data received
          //unless the user is a MC then we don't want to open the panel
          if (this.roleType != RoleType.Maintenance) {
            this.countiesAutocomplete.openPanel();
          }
          this.countiesFilteringArray = of(data);
          //have to reestablish the filtering since, apparently, populating the array with data breaks the valuechanges event watcher
          this.countiesTemplateArray = this.setAreaFilterFormValueChangesEvent(
            'countiesForm',
            this.countiesFilteringArray,
          );
        });
    } else {
      console.error(
        `HeaderComponent:maintSelectEvent: Error: A Maintenance Office filter was selected however a district has not been chosen`,
      );
    }
  }

  countySelectEvent($event: any) {
    const selectedOption = $event;
    //the county filter is being set. It can be set along with the
    //district and maint ofc filters or on its own so we mush verify the state
    if (this.districtFilter) {
      console.log(
        'in the county filter event wiht this.districtFilter: ',
        this.districtFilter,
      );

      if (this.maintOfcFilter) {
        this.dataFilter.setCounty(
          this.districtFilter,
          this.maintOfcFilter,
          selectedOption,
        );
      } else {
        console.error(
          `AreaFilterComponent:countySelectEvent: Error: Got a county selection however the local district filter is set but the local maintenance office filter is not`,
        );
      }
    } else {
      //the district filter is not set so the user just wants to filter on county
      //we need to clear out the maintenance selection as well
      this.maintOfficeReset();
      this.dataFilter.setCounty(null, null, selectedOption);
    }
    this.countyFilter = selectedOption;
  }
}
