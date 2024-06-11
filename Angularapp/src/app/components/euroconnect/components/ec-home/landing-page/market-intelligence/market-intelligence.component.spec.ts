import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketIntelligenceComponent } from './market-intelligence.component';

describe('MarketIntelligenceComponent', () => {
  let component: MarketIntelligenceComponent;
  let fixture: ComponentFixture<MarketIntelligenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketIntelligenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketIntelligenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
