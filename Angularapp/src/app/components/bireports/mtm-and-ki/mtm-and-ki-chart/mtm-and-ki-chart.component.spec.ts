import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmAndKiChartComponent } from './mtm-and-ki-chart.component';

describe('MtmAndKiChartComponent', () => {
  let component: MtmAndKiChartComponent;
  let fixture: ComponentFixture<MtmAndKiChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmAndKiChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MtmAndKiChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
