import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcAccumulatorComponent } from './ec-accumulator.component';

describe('EcAccumulatorComponent', () => {
  let component: EcAccumulatorComponent;
  let fixture: ComponentFixture<EcAccumulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcAccumulatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcAccumulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
