import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesAndRevenuePerformanceComponent } from './sales-and-revenue-performance.component';

describe('SalesAndRevenuePerformanceComponent', () => {
  let component: SalesAndRevenuePerformanceComponent;
  let fixture: ComponentFixture<SalesAndRevenuePerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesAndRevenuePerformanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesAndRevenuePerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
