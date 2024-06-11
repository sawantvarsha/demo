import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrelationAnalyticsComponent } from './correlation-analytics.component';

describe('CorrelationAnalyticsComponent', () => {
  let component: CorrelationAnalyticsComponent;
  let fixture: ComponentFixture<CorrelationAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrelationAnalyticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrelationAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
