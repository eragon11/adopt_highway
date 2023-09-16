import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AgreementService } from './agreement.service';

describe('AgreementService', () => {
  let service: AgreementService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(AgreementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
