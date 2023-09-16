import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import {
  SingleDataSet,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
} from 'ng2-charts';

@Component({
  selector: 'app-agreement-renewals',
  templateUrl: './agreement-renewals.component.html',
  styleUrls: ['./agreement-renewals.component.css'],
})
export class AgreementRenewalsComponent implements OnInit {
  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: { position: 'right' },
  };

  public pieChartLabels: Label[] = [
    'Next 30 days',
    '31 to 60 days',
    'More than 60 days',
  ];

  public pieChartData: SingleDataSet = [60, 10, 30];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor() {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
    return;
  }
}
