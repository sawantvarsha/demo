import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMarginReportComponent } from './customer-margin-report.component';

describe('CustomerMarginReportComponent', () => {
  let component: CustomerMarginReportComponent;
  let fixture: ComponentFixture<CustomerMarginReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerMarginReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerMarginReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
