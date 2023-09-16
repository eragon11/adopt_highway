import { Type } from '@angular/core';

//Generic class used to instantiate a reporting component on the fly. Using the generic 
//class allows us to intaniate any reporting component without having to change the code
export class Report {
  constructor(public component: Type<any>, public data: any) {}
}