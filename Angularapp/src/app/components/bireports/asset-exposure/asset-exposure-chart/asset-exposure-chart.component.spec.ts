import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetExposureChartComponent } from './asset-exposure-chart.component';

describe('AssetExposureChartComponent', () => {
  let component: AssetExposureChartComponent;
  let fixture: ComponentFixture<AssetExposureChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetExposureChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetExposureChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
