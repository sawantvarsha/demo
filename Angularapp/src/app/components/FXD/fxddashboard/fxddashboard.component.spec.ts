import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FXDDashboardComponent } from './fxddashboard.component';

describe('FXDDashboardComponent', () => {
  let component: FXDDashboardComponent;
  let fixture: ComponentFixture<FXDDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FXDDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FXDDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
