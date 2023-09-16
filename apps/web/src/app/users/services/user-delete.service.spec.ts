import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserDeleteService } from './user-delete.service';

describe('UserDeleteService', () => {
  let service: UserDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(UserDeleteService);
  });

  it('should be deleted', () => {
    expect(service).toBeTruthy();
  });
});
