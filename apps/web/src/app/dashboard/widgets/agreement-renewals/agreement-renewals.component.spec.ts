import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementRenewalsComponent } from './agreement-renewals.component';

describe('AgreementRenewalsComponent', () => {
  let component: AgreementRenewalsComponent;
  let fixture: ComponentFixture<AgreementRenewalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgreementRenewalsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementRenewalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
