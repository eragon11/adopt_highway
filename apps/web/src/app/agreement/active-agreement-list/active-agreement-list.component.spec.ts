import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveAgreementComponent } from './active-agreement-list.component';

describe('ActiveAgreementComponent', () => {
  let component: ActiveAgreementComponent;
  let fixture: ComponentFixture<ActiveAgreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveAgreementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
