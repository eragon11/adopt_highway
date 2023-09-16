import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementsByStatusComponent } from './agreements-by-status.component';

describe('AgreementsByStatusComponent', () => {
  let component: AgreementsByStatusComponent;
  let fixture: ComponentFixture<AgreementsByStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgreementsByStatusComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementsByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
