import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormHelperService {
  validateForm(control: AbstractControl) {
    if (control instanceof FormArray) {
      control.controls.forEach((element) => {
        this.validateForm(element);
      });
    } else if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach((field) => {
        this.validateForm(control.get(field));
      });
    } else if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
      if (control.status === 'INVALID') {
        console.log(control);
      }
    }
  }
}

export const Regex = {
  ZIP: '^[0-9]{5}(?:-[0-9]{4})?$',
};
