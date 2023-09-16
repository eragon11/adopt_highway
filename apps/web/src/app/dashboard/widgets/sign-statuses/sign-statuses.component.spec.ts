import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignStatusesComponent } from './sign-statuses.component';

describe('SignStatusesComponent', () => {
  let component: SignStatusesComponent;
  let fixture: ComponentFixture<SignStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignStatusesComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
