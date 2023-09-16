import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, Subscription, of } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { District } from 'src/app/common/models/district';
import { MaintOffice } from 'src/app/common/models/maintOffice';
import { AuthenticationService } from 'src/app/auth/_services';
import { RoleType } from 'src/app/auth/_models/role-type';
import { AreaDataService } from 'src/app/common/services/area-data.service';
import { AgreementFilterService } from '../services/agreement-filter.service';

@Component({
  selector: 'agreement-filter',
  templateUrl: './agreement-filter.component.html',
  styleUrls: ['./agreement-filter.component.css'],
})
export class AgreementFilterComponent implements OnInit {
  private subscr: Subscription;
  private groupNameSubscr: Subscription;
  isDistrictCoordinator = false;

  agreementFilterForm = new FormGroup({
    districtForm: new FormControl(),
    countyForm: new FormControl(
      { value: '', disabled: false },
      Validators.required,
    ),
    filterGroupName: new FormControl(),
  });

  constructor(
    public areaDataService: AreaDataService,
    public agreementFilterService: AgreementFilterService,
    private authService: AuthenticationService, // public agreementDataService: AgreementDataService,
  ) {
    this.subscr = this.agreementFilterForm
      .get('districtForm')
      .valueChanges.subscribe(() => {
        if (this.agreementFilterForm.controls['districtForm'].value === '') {
          // TODO: Add more nuanced logic for enabling/disabling the MO input -
          // i.e. only enable when user has selected a District
          this.agreementFilterForm.controls['countyForm'].setValue('');
          this.agreementFilterForm.controls['countyForm'].disable();
          this.isDistrictEmpty = true;
          this.districtInputEmpty();
        } else {
          this.agreementFilterForm.controls['countyForm'].enable();
          this.isDistrictEmpty = false;
        }
      });

    this.groupNameSubscr = this.agreementFilterForm
      .get('filterGroupName')
      .valueChanges.pipe(
        debounceTime(1000),
        switchMap(async (value) =>
          this.agreementFilterService.setSearchStr(value),
        ),
      )
      .subscribe();
  }

  public authRoleType: string;
  public districtsTemplateArray: Observable<Array<District>>;
  public districtsFilteringArray: Observable<Array<District>>;
  public countiesTemplateArray: Observable<Array<MaintOffice>>;
  public countiesFilteringArray: Observable<Array<MaintOffice>>;

  //Used to keep track of the template state of the filters
  private districtFilter: string;
  private countyFilter: string;
  public isDistrictEmpty: boolean;
  public agreementSearchFilter: string = null;

  public selectedRoleTypes: any[];

  //used to open the selection panels
  @ViewChild('countiesTrigger', { read: MatAutocompleteTrigger })
  countiesAutocomplete: MatAutocompleteTrigger;

  ngOnInit(): void {
    //the <area>FilteringArray arrays are used for filtering. the arrays with the TemplateArray appended are bound to the template
    //We need to populate the district array with the full list so the user can filter on them
    //The county array is empty until the users chooses a district, then it will be populated
    this.authRoleType = this.authService.getSelectedRoleType();
    switch (this.authRoleType) {
      case RoleType.ReadOnlyUser:
      case RoleType.Administrator: {
        this.agreementFilterForm.controls['countyForm'].disable();
        this.districtsFilteringArray = this.areaDataService.getDistricts();
        this.districtsTemplateArray = this.setAreaFilterFormValueChangesEvent(
          'districtForm',
          this.districtsFilteringArray,
        );
        this.countiesFilteringArray = of([]);
        this.countiesTemplateArray = this.setAreaFilterFormValueChangesEvent(
          'countyForm',
          this.countiesFilteringArray,
        );
        break;
      }
      case RoleType.District: {
        const districtNum = this.authService.getDistrictNumber().toString();
        this.isDistrictCoordinator = true;
        this.isDistrictEmpty = false;
        this.districtSelectEvent(districtNum);
        this.countiesFilteringArray = of([]);
        this.countiesTemplateArray = this.setAreaFilterFormValueChangesEvent(
          'countyForm',
          this.countiesFilteringArray,
        );
        break;
      }
      case RoleType.Maintenance:
    }
  }

  ngOnDestroy() {
    this.subscr.unsubscribe();
  }

  // ------ District / County Section Filters  ----- //
  setAreaFilterFormValueChangesEvent(
    formControlName: string,
    filterArray: Observable<any>,
  ): Observable<any> {
    return this.agreementFilterForm.controls[formControlName].valueChanges.pipe(
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
    this.agreementFilterService.setDistrict(district);
  }

  districtSelectEvent($event: any) {
    const districtSelected = $event;
    this.areaDataService.getCounties(districtSelected).subscribe((data) => {
      //need to clear out the inputs for county. The selection arrays will be repopulated
      this.agreementFilterForm.controls['countyForm'].setValue('');
      //set the district selected locally (template) and in the service
      this.setDistrictInputs(districtSelected);
      this.countiesFilteringArray = of(data);

      //have to reestablish the filtering since, apparently, populating the array with data breaks the valuechanges event watcher
      this.countiesTemplateArray = this.setAreaFilterFormValueChangesEvent(
        'countyForm',
        this.countiesFilteringArray,
      );
    });
  }

  setCountyInputs(countyID: string): void {
    //need to set district values locally for the template and in the service for them to match
    this.countyFilter = countyID;
    if (this.districtFilter) {
      this.agreementFilterService.setCounty(this.districtFilter, countyID);
    } else {
      console.error(
        `AgreementFilterComponent:setCounty: Error: A Maintenance Office filter was selected however a district has not been set locally`,
      );
    }
  }

  countySelectEvent($event: any) {
    const selectedOption = $event;
    if (this.districtFilter) {
      this.areaDataService
        .getCounties(this.districtFilter, selectedOption)
        .subscribe((data) => {
          //set the maint office selected locally (template) and in the service
          this.setCountyInputs(selectedOption);
        });
    } else {
      console.error(
        `HeaderComponent:maintSelectEvent: Error: A Maintenance Office filter was selected however a district has not been chosen`,
      );
    }
  }

  districtInputEmpty() {
    this.agreementFilterService.clearAreaFilters();
  }

  watchCountyInput() {
    if (this.agreementFilterForm.controls['countyForm'].value === '') {
      console.error('this.districtFilter: ', this.districtFilter);
      this.agreementFilterService.resetToDistrictFilter(this.districtFilter);
    }
  }

  // ----------   End area filters ---------------------------//
  searchUser(event) {
    this.agreementFilterService.setSearchStr(event);
  }
}
