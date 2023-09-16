import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { PickupType } from 'src/app/auth/_models/pickup-type';
import { PickupService } from '../services/pickup.service';
import { DialogData } from 'src/app/application/dialog/dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatDate } from '@angular/common';
import { DeletePickupDialogComponent } from '../delete-pickup-dialog/delete-pickup-dialog.component';

@Component({
  selector: 'app-add-pickup',
  templateUrl: './add-pickup.component.html',
  styleUrls: ['./add-pickup.component.css'],
})
export class AddPickupComponent implements OnInit {
  isEdit = false;
  pickupForm: FormGroup;
  formIsValid = false;
  pickupTypes = PickupType;
  pickupTypesArr = Object.values(PickupType);
  agreementId: number;
  pickupId: number;
  maxCommentLength = 500;
  todaysDate = new Date();

  defaultPickupType = this.pickupTypes.TrashOff;
  constructor(
    public dialogRef: MatDialogRef<AddPickupComponent>,
    public deleteDialog: MatDialog,
    private fb: FormBuilder,
    public pickupService: PickupService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.pickupForm = this.fb.group({
      type: [null],
      pickupDate: [null],
      numberOfBagsCollected: [null, [Validators.min(1), Validators.max(1000)]],
      numberOfVolunteers: [null, [Validators.min(1), Validators.max(1000)]],
      comments: ['', [Validators.maxLength(this.maxCommentLength)]],
    });
    this.agreementId = this.data.agreementId;
    if (this.data.props) {
      this.isEdit = true;
      this.pickupId = this.data.props.pickupId;
      this.pickupForm.controls.type.setValue(this.data.props.type);
      this.pickupForm.controls.pickupDate.setValue(
        new Date(this.data.props.pickupDate),
      );
      this.pickupForm.controls.numberOfBagsCollected.setValue(
        this.data.props.numberOfBagsCollected,
      );
      this.pickupForm.controls.numberOfVolunteers.setValue(
        this.data.props.numberOfVolunteers,
      );
      this.pickupForm.controls.comments.setValue(this.data.props.comments);
    }

    this.pickupForm.statusChanges.subscribe((status) => {
      if (status === 'VALID') {
        this.formIsValid = true;
      } else {
        this.formIsValid = false;
      }
    });
  }

  savePickup() {
    let formData = this.pickupForm.value;
    formData = this.updateDateFormats(formData);

    if (this.isEdit) {
      // only update changed fields
      this.pickupService.updatePickup(formData, this.pickupId, this.dialogRef);
    } else {
      this.pickupService.createPickup(
        formData,
        this.agreementId,
        this.dialogRef,
      );
    }
  }

  onDeleteClick() {
    if (this.isEdit) {
      const formattedDate = formatDate(
        new Date(this.pickupForm.controls.pickupDate.value),
        'MM/dd/yyyy',
        'en',
      );
      const deleteDialogRef = this.deleteDialog.open(
        DeletePickupDialogComponent,
        {
          data: {
            pickupId: this.pickupId,
            date: formattedDate,
          },
        },
      );

      deleteDialogRef.afterClosed().subscribe((result) => {
        // If the user selected "delete" delete the user
        if (result) {
          this.pickupService.deletePickup(this.pickupId, this.dialogRef);
          this.dialogRef.close({ event: 'cancel' });
        }
      });
    }
  }

  setType(type: string) {
    this.pickupForm.value.type = type;
  }

  dateChange(type: string, event: MatDatepickerInputEvent<Date>, id: string) {
    console.log(type, event, id);
    console.log(event.value?.toLocaleDateString('en-us'));
    // this.pickupForm.controls[id].setValue(
    //   event.value.toLocaleDateString('en-us'),
    // );
  }

  updateDateFormats(formData) {
    formData.pickupDate =
      formData.pickupDate.toString().length > 10
        ? formatDate(new Date(formData.pickupDate), 'MM/dd/yyyy', 'en')
        : formData.pickupDate;
    return formData;
  }

  onNoClick() {
    this.dialogRef.close({ event: 'cancel' });
  }
}
