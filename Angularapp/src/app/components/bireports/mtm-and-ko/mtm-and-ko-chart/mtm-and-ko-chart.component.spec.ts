import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtmAndKoChartComponent } from './mtm-and-ko-chart.component';

describe('MtmAndKoChartComponent', () => {
  let component: MtmAndKoChartComponent;
  let fixture: ComponentFixture<MtmAndKoChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtmAndKoChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MtmAndKoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
