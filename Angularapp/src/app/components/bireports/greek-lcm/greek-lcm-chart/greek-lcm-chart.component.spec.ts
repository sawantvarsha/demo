import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreekLcmChartComponent } from './greek-lcm-chart.component';

describe('GreekLcmChartComponent', () => {
  let component: GreekLcmChartComponent;
  let fixture: ComponentFixture<GreekLcmChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreekLcmChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GreekLcmChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
