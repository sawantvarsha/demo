import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoughnutChartCurrencyComponent } from './doughnut-chart-currency.component';

describe('DoughnutChartCurrencyComponent', () => {
  let component: DoughnutChartCurrencyComponent;
  let fixture: ComponentFixture<DoughnutChartCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoughnutChartCurrencyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoughnutChartCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
