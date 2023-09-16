import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';

import {
  SingleDataSet,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
} from 'ng2-charts';

@Component({
  selector: 'app-segments-by-status',
  templateUrl: './segments-by-status.component.html',
  styleUrls: ['./segments-by-status.component.css'],
})
export class SegmentsByStatusComponent implements OnInit {
  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: { position: 'right' },
  };

  public pieChartLabels: Label[] = [
    'Adopted',
    'Pending',
    'In Progress',
    'Deactivated',
    'Avaialble',
    'Not Assessed',
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
