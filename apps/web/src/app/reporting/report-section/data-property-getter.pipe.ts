
import {Pipe, PipeTransform} from '@angular/core';
import { obj } from 'find-config';

@Pipe({
  name: 'dataPropertyGetter'
})
export class DataPropertyGetterPipe implements PipeTransform {

  transform(object: any, keyName: string, ...args: unknown[]): unknown {
    if (object) {
      return object[keyName];
    }
  }

}