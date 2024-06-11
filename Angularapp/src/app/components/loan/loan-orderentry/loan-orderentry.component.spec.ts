import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanOrderentryComponent } from './loan-orderentry.component';

describe('LoanOrderentryComponent', () => {
  let component: LoanOrderentryComponent;
  let fixture: ComponentFixture<LoanOrderentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanOrderentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanOrderentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
