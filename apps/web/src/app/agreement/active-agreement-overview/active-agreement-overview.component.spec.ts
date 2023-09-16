import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveAgreementOverviewComponent } from './active-agreement-overview.component';

describe('ActiveAgreementOverviewComponent', () => {
  let component: ActiveAgreementOverviewComponent;
  let fixture: ComponentFixture<ActiveAgreementOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveAgreementOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveAgreementOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
