import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectApplicationDialogComponent } from './reject-application-dialog.component';

describe('RejectApplicationDialogComponent', () => {
  let component: RejectApplicationDialogComponent;
  let fixture: ComponentFixture<RejectApplicationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectApplicationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectApplicationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
