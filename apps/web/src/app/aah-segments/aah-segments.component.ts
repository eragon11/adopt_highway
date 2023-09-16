import { Component, OnInit } from '@angular/core';

import { Segment } from './segment';
import { TxdotAahSegmentDataService } from './txdot-aah-segment-data.service';

@Component({
  selector: 'app-aah-segments',
  templateUrl: './aah-segments.component.html',
  providers: [TxdotAahSegmentDataService],
  styleUrls: ['./aah-segments.component.css'],
})
export class AahSegmentsComponent implements OnInit {
  segments: Segment[];

  constructor(private segmentService: TxdotAahSegmentDataService) {}

  ngOnInit() {
    this.getSegments();
  }

  getSegments(): void {
    this.segmentService
      .getSegments()
      .subscribe((segments) => (this.segments = segments));
  }
}
