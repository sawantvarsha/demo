import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitsControlsComponent } from './limits-controls.component';

describe('LimitsControlsComponent', () => {
  let component: LimitsControlsComponent;
  let fixture: ComponentFixture<LimitsControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LimitsControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitsControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
