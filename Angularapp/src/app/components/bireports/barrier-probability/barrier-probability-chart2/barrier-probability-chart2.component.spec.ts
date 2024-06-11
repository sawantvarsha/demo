import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarrierProbabilityChart2Component } from './barrier-probability-chart2.component';

describe('BarrierProbabilityChart2Component', () => {
  let component: BarrierProbabilityChart2Component;
  let fixture: ComponentFixture<BarrierProbabilityChart2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarrierProbabilityChart2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarrierProbabilityChart2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
