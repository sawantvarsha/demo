import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceTimelineComponent } from './performance-timeline.component';

describe('PerformanceTimelineComponent', () => {
  let component: PerformanceTimelineComponent;
  let fixture: ComponentFixture<PerformanceTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerformanceTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
