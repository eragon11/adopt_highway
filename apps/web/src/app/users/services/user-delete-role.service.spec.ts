import { TestBed } from '@angular/core/testing';

import { UserDeleteRoleService } from './user-delete-role.service';

describe('UserDeleteRoleService', () => {
  let service: UserDeleteRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDeleteRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
