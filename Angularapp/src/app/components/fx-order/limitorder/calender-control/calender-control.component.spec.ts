import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderControlComponent } from './calender-control.component';

describe('CalenderControlComponent', () => {
  let component: CalenderControlComponent;
  let fixture: ComponentFixture<CalenderControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalenderControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalenderControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
