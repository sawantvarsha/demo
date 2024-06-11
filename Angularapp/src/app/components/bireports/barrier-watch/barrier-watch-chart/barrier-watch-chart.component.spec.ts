import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarrierWatchChartComponent } from './barrier-watch-chart.component';

describe('BarrierWatchChartComponent', () => {
  let component: BarrierWatchChartComponent;
  let fixture: ComponentFixture<BarrierWatchChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarrierWatchChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarrierWatchChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
