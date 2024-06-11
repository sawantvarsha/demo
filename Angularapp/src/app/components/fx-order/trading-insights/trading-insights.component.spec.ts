import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingInsightsComponent } from './trading-insights.component';

describe('TradingInsightsComponent', () => {
  let component: TradingInsightsComponent;
  let fixture: ComponentFixture<TradingInsightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradingInsightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradingInsightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
