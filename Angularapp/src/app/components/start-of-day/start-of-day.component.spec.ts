import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartOfDayComponent } from './start-of-day.component';

describe('StartOfDayComponent', () => {
  let component: StartOfDayComponent;
  let fixture: ComponentFixture<StartOfDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartOfDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartOfDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
