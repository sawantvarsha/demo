import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayCalenderViewerComponent } from './holiday-calender-viewer.component';

describe('HolidayCalenderViewerComponent', () => {
  let component: HolidayCalenderViewerComponent;
  let fixture: ComponentFixture<HolidayCalenderViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayCalenderViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayCalenderViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
