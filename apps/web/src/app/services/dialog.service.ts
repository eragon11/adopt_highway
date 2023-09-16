/* eslint-disable prettier/prettier */
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  DialogComponent,
  DialogData,
} from '../application/dialog/dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDialog(data: DialogData) {
    return this.dialog.open(DialogComponent, {
      data: data,
    });
  }
}

