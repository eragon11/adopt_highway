import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'user-delete',
  templateUrl: 'user-delete.dialog.html',
  styleUrls: ['user-delete.dialog.css'],
})
export class UserDeleteDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
