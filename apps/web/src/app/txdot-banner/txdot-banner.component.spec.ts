import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxdotBannerComponent } from './txdot-banner.component';

describe('TxdotBannerComponent', () => {
  let component: TxdotBannerComponent;
  let fixture: ComponentFixture<TxdotBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TxdotBannerComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TxdotBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
