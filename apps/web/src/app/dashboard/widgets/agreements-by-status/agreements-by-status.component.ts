import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import {
  SingleDataSet,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
} from 'ng2-charts';

@Component({
  selector: 'app-agreements-by-status',
  templateUrl: './agreements-by-status.component.html',
  styleUrls: ['./agreements-by-status.component.css'],
})
export class AgreementsByStatusComponent implements OnInit {
  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: { position: 'right' },
  };
  public pieChartLabels: Label[] = [
    'Active',
    'Cancelled',
    'Complete',
    'Pending',
    'Renewal',
    'Suspended',
  ];
  public pieChartData: SingleDataSet = [40, 30, 10, 5, 5, 10];
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
