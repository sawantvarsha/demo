import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsAndEngagementComponent } from './alerts-and-engagement.component';

describe('AlertsAndEngagementComponent', () => {
  let component: AlertsAndEngagementComponent;
  let fixture: ComponentFixture<AlertsAndEngagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertsAndEngagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsAndEngagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
