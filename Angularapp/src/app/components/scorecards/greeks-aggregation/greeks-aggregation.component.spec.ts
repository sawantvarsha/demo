import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreeksAggregationComponent } from './greeks-aggregation.component';

describe('GreeksAggregationComponent', () => {
  let component: GreeksAggregationComponent;
  let fixture: ComponentFixture<GreeksAggregationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreeksAggregationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GreeksAggregationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
