import { TestBed } from '@angular/core/testing';

import { DistrictCoordinatorsService } from './district-coordinators.service';

describe('DistrictCoordinatorsService', () => {
  let service: DistrictCoordinatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistrictCoordinatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
