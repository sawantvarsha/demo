import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcmBarChartComponent } from './lcm-bar-chart.component';

describe('LcmBarChartComponent', () => {
  let component: LcmBarChartComponent;
  let fixture: ComponentFixture<LcmBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcmBarChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LcmBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
