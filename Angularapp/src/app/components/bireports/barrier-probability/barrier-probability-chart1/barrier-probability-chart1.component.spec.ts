import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarrierProbabilityChart1Component } from './barrier-probability-chart1.component';

describe('BarrierProbabilityChart1Component', () => {
  let component: BarrierProbabilityChart1Component;
  let fixture: ComponentFixture<BarrierProbabilityChart1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarrierProbabilityChart1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarrierProbabilityChart1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
