import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { VolunteerGuard } from './volunteer.guard';

describe('VolunteerGuard', () => {
  let guard: VolunteerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    guard = TestBed.inject(VolunteerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
