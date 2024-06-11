import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarrierProbabilityComponent } from './barrier-probability.component';

describe('BarrierProbabilityComponent', () => {
  let component: BarrierProbabilityComponent;
  let fixture: ComponentFixture<BarrierProbabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarrierProbabilityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarrierProbabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
