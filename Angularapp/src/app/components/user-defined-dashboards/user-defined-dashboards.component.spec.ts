import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDefinedDashboardsComponent } from './user-defined-dashboards.component';

describe('UserDefinedDashboardsComponent', () => {
  let component: UserDefinedDashboardsComponent;
  let fixture: ComponentFixture<UserDefinedDashboardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDefinedDashboardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDefinedDashboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
