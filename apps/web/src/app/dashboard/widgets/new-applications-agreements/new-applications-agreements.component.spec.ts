import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewApplicationsAgreementsComponent } from './new-applications-agreements.component';

describe('NewApplicationsAgreementsComponent', () => {
  let component: NewApplicationsAgreementsComponent;
  let fixture: ComponentFixture<NewApplicationsAgreementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewApplicationsAgreementsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewApplicationsAgreementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
