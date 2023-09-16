import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePickupDialogComponent } from './delete-pickup-dialog.component';

describe('DeletePickupDialogComponent', () => {
  let component: DeletePickupDialogComponent;
  let fixture: ComponentFixture<DeletePickupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeletePickupDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePickupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
