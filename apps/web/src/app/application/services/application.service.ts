import { Injectable } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Regex } from 'src/app/helpers/form-helper.service';
import { CustomTel } from '../tel-input/tel-input';

@Injectable()
export class ApplicationService {
  groupTypes = {
    Business: 'BUSINESS',
    Civic: 'CIVIC',
    Family: 'FAMILY',
    Government: 'GOVERNMENT',
    Other: 'OTHER',
    Religious: 'RELIGIOUS',
    School: 'SCHOOL',
    Scouts: 'SCOUTS',
  };

  constructor(private formBuilder: FormBuilder) {}

  createApplicationForm(): FormGroup {
    return this.formBuilder.group({
      groupName: ['', Validators.required],
      isSchool: [false, Validators.required],
      groupAddressLine1: ['', Validators.required],
      groupAddressLine2: [''],
      groupCity: ['', Validators.required],
      groupPostalCode: [
        '',
        [Validators.required, Validators.pattern(Regex.ZIP)],
      ],
      groupDescription: ['', Validators.required],
      groupWebsiteUrl: [''],
      groupCountyNumber: ['', Validators.required],
      estimateNumberOfVolunteers: [null, Validators.required],
      groupType: ['', Validators.required],
      primaryContactFirstName: ['', Validators.required],
      primaryContactLastName: ['', Validators.required],
      primaryContactAddressLine1: ['', Validators.required],
      primaryContactAddressLine2: [''],
      primaryContactCity: ['', Validators.required],
      primaryContactPostalCode: [
        '',
        [Validators.required, Validators.pattern(Regex.ZIP)],
      ],
      primaryContactPhoneNumber: [
        new CustomTel(null, null, null),
        [Validators.required],
      ],
      primaryContactEmail: ['', Validators.required],
      primaryContactConfirmEmail: ['', Validators.required],
      primaryContactCountyNumber: ['', Validators.required],
      secondaryContactFirstName: ['', Validators.required],
      secondaryContactLastName: ['', Validators.required],
      secondaryContactAddressLine1: ['', Validators.required],
      secondaryContactAddressLine2: [''],
      secondaryContactCity: ['', Validators.required],
      secondaryContactPostalCode: [
        '',
        [Validators.required, Validators.pattern(Regex.ZIP)],
      ],
      secondaryContactPhoneNumber: [
        new CustomTel(null, null, null),
        [Validators.required],
      ],
      secondaryContactCountyNumber: ['', Validators.required],
      secondaryContactEmail: ['', Validators.required],
      secondaryContactConfirmEmail: ['', Validators.required],
      schoolName: ['', Validators.required],
      schoolEmail: ['', Validators.required],
      schoolConfirmEmail: ['', Validators.required],
      schoolPhoneNumber: [
        new CustomTel(null, null, null),
        [Validators.required],
      ],
      requestedHighwayDescription: ['', Validators.required],
      requestedAlternateHighwayDescription: [''],
      requestedHighwayCountyNumber: ['', Validators.required],
      aahSegmentId: [''],
      aahRouteName: new FormControl({ value: '', disabled: true }),
      signLine_1: ['', Validators.required],
      signLine_2: [''],
      signLine_3: [''],
      signLine_4: [''],
      requiredPickupsPerYear: [null, Validators.required],
      txdotContactUserId: ['', Validators.required],
      agreementStartDate: ['', Validators.required],
      agreementEndDate: ['', Validators.required],
      pickupsStartDate: ['', Validators.required],
    });
  }
}
