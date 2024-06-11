import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowAggregationComponent } from './cashflow-aggregation.component';

describe('CashflowAggregationComponent', () => {
  let component: CashflowAggregationComponent;
  let fixture: ComponentFixture<CashflowAggregationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashflowAggregationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowAggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
