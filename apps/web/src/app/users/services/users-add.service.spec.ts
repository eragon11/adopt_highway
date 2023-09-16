import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { UsersAddService } from './users-add.service';

describe('UsersAddService', () => {
  let service: UsersAddService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });
    service = TestBed.inject(UsersAddService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
