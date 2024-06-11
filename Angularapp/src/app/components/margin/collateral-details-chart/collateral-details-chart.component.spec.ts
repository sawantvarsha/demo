import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateralDetailsChartComponent } from './collateral-details-chart.component';

describe('CollateralDetailsChartComponent', () => {
  let component: CollateralDetailsChartComponent;
  let fixture: ComponentFixture<CollateralDetailsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollateralDetailsChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollateralDetailsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
