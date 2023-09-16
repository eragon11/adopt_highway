import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationRequestDialogComponent } from './application-request-dialog.component';

describe('ApplicationRequestDialogComponent', () => {
  let component: ApplicationRequestDialogComponent;
  let fixture: ComponentFixture<ApplicationRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationRequestDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
