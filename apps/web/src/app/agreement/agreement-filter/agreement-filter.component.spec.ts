import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgreementFilterComponent } from './agreement-filter.component';

describe('AgreementFilterComponent', () => {
  let component: AgreementFilterComponent;
  let fixture: ComponentFixture<AgreementFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgreementFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgreementFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
