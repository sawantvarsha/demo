import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalMarginReportComponent } from './global-margin-report.component';

describe('GlobalMarginReportComponent', () => {
  let component: GlobalMarginReportComponent;
  let fixture: ComponentFixture<GlobalMarginReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalMarginReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalMarginReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
