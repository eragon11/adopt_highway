import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationSignDialogComponent } from './application-sign-dialog.component';

describe('ApplicationSignDialogComponent', () => {
  let component: ApplicationSignDialogComponent;
  let fixture: ComponentFixture<ApplicationSignDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationSignDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationSignDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
