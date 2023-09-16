import { Component, Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-user-role-delete-dialog',
  templateUrl: 'user-role-delete-dialog.component.html',
  styleUrls: ['user-role-delete-dialog.component.css'],
})
export class UserRoleDeleteDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
