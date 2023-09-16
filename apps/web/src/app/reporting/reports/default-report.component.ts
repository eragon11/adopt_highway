import { Component } from '@angular/core';

@Component({
  selector: 'app-default-report',
  template: `
    <h2 class="announcement">
      Report not implemented
    </h2>
  `,
  styles: [ `
  .announcement {
    color: white;
    width: 100% !important;
    text-align: center;
  }
  `
  ]
})
// The Default Report is used when a report has not been configured. It shows the above html to notify the user
export class DefaultReportComponent {

}
