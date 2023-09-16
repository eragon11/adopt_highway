import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveApplicationDialogComponent } from './approve-application-dialog.component';

describe('ApproveApplicationDialogComponent', () => {
  let component: ApproveApplicationDialogComponent;
  let fixture: ComponentFixture<ApproveApplicationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveApplicationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveApplicationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
