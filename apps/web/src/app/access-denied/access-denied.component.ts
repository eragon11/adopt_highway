import { Component, Output } from '@angular/core';

@Component({
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css'],
})
export class AccessDeniedComponent {
  @Output() showPage = true;

  constructor() {}
}
