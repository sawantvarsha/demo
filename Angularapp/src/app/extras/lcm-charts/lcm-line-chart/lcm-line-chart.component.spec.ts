import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcmLineChartComponent } from './lcm-line-chart.component';

describe('LcmLineChartComponent', () => {
  let component: LcmLineChartComponent;
  let fixture: ComponentFixture<LcmLineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcmLineChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LcmLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
