import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[rptHost]'
})
export class RptDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
