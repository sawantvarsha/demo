import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyLimitsComponent } from './daily-limits.component';

describe('DailyLimitsComponent', () => {
  let component: DailyLimitsComponent;
  let fixture: ComponentFixture<DailyLimitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyLimitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
