import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcmScheduleComponent } from './lcm-schedule.component';

describe('LcmScheduleComponent', () => {
  let component: LcmScheduleComponent;
  let fixture: ComponentFixture<LcmScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcmScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LcmScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
