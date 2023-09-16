/* eslint-disable prettier/prettier */
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  title?: string;
  message?: string;
  content?: string;
  btnOk?: string;
  btnClose?: string;
  showDefaultClose?: boolean;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogComponent>,
  ) {}

  ngOnInit(): void {}

  onClickOk() {
    this.dialogRef.close(true);
  }

  onClickClose() {
    this.dialogRef.close(false);
  }
}
