import { Component, Output } from '@angular/core';

@Component({
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css'],
})
export class ServerErrorComponent {
  @Output() showPage = true;

  constructor() {}
}
