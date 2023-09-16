import { TestBed } from '@angular/core/testing';

import { AgreementFilterService } from './agreement-filter.service';

describe('AgreementFilterService', () => {
  let service: AgreementFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgreementFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
