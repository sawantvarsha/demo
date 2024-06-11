import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcEventCalendarComponent } from './ec-event-calendar.component';

describe('EcEventCalendarComponent', () => {
  let component: EcEventCalendarComponent;
  let fixture: ComponentFixture<EcEventCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcEventCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcEventCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
