import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KiAndWorstOfPerformanceChartComponent } from './wof-and-ki-chart.component';

describe('MtmAndKiChartComponent', () => {
  let component: KiAndWorstOfPerformanceChartComponent;
  let fixture: ComponentFixture<KiAndWorstOfPerformanceChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KiAndWorstOfPerformanceChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KiAndWorstOfPerformanceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
