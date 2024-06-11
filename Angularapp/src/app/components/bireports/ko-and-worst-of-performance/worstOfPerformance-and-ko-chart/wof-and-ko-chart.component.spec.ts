import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KoAndWorstOfPerformanceChartComponent } from './wof-and-ko-chart.component';

describe('MtmAndKiChartComponent', () => {
  let component: KoAndWorstOfPerformanceChartComponent;
  let fixture: ComponentFixture<KoAndWorstOfPerformanceChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KoAndWorstOfPerformanceChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KoAndWorstOfPerformanceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
