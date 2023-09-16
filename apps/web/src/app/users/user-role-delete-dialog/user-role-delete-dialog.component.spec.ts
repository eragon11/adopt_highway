import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleDeleteDialogComponent } from './user-role-delete-dialog.component';

describe('UserRoleDeleteDialogComponent', () => {
  let component: UserRoleDeleteDialogComponent;
  let fixture: ComponentFixture<UserRoleDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRoleDeleteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
