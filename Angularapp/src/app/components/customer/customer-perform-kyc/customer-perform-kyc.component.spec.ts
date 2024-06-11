import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPerformKycComponent } from './customer-perform-kyc.component';

describe('CustomerPerformKycComponent', () => {
  let component: CustomerPerformKycComponent;
  let fixture: ComponentFixture<CustomerPerformKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerPerformKycComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPerformKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
