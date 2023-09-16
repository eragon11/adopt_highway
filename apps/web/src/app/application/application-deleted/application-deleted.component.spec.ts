import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDeletedComponent } from './application-deleted.component';

describe('ApplicationDeletedComponent', () => {
  let component: ApplicationDeletedComponent;
  let fixture: ComponentFixture<ApplicationDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationDeletedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
