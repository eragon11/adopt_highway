import { Component, OnInit, Input, ViewChild, ViewContainerRef, Inject, Injectable, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import { RptDirective } from './report-section/rpt.directive';
import { Report } from './report-section/report';
import { BaseDataComponent } from 'src/app/common/components/base-data.component';
@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css'],
})

//The reporting Component serves as the overall component for reports. It provides
//the html framework for the entire reporting page includeing headers, report cards, and
//the individual report tables. It switches out the reports by instantiating components on the fly
export class ReportingComponent implements OnInit {

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    console.warn(`In ReportingComponent constructor`)
  }

  ngOnInit () {
    console.warn(`In ReportingComponent OnInit`)

  }

  showInitialMsg: boolean = true;

  @Input() rpt: Report;
  @ViewChild(RptDirective, { static: true}) rptHost!: RptDirective;

  setReport (newRpt: Report) {
    //lets turn off the intial msg
    this.showInitialMsg = false;
    const currentReport = newRpt;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(currentReport.component)
    const viewContainerRef = this.rptHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<BaseDataComponent>(componentFactory);
    // componentRef.instance.data = currentReport.data;
  }

}
