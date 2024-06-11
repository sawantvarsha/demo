import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSummaryCardComponent } from './order-summary-card.component';

describe('OrderSummaryCardComponent', () => {
  let component: OrderSummaryCardComponent;
  let fixture: ComponentFixture<OrderSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderSummaryCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
