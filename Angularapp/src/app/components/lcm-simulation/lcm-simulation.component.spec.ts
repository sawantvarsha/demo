import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcmSimulationComponent } from './lcm-simulation.component';

describe('LcmSimulationComponent', () => {
  let component: LcmSimulationComponent;
  let fixture: ComponentFixture<LcmSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcmSimulationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LcmSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
