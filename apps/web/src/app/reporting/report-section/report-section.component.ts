import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { RptDirective } from './rpt.directive';

@Component({
  selector: 'report-section',
  template: `
    <ng-template rptHost></ng-template>
  `,
  styles: [
  ]
})
export class ReportSectionComponent {

  @Input() rpt: string;
  @ViewChild(RptDirective, { static: true}) rptHost!: RptDirective;

  constructor() { }

  setReport (newRpt: string) {
    const currentReport = this.rpt;
    const viewContainerRef = this.rptHost.viewContainerRef;
    // const componentRef = this.rptHost.createComponent<ReportingB
    this.rpt = newRpt;
  }


}
