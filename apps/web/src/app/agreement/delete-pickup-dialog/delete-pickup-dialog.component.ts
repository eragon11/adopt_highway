import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-pickup-dialog',
  templateUrl: './delete-pickup-dialog.component.html',
  styleUrls: ['./delete-pickup-dialog.component.css'],
})
export class DeletePickupDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
