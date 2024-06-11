import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoughnutChartPayoffComponent } from './doughnut-chart-payoff.component';

describe('DoughnutChartPayoffComponent', () => {
  let component: DoughnutChartPayoffComponent;
  let fixture: ComponentFixture<DoughnutChartPayoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoughnutChartPayoffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoughnutChartPayoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
