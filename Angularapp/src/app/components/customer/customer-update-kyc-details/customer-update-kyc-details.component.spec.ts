import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerUpdateKycDetailsComponent } from './customer-update-kyc-details.component';

describe('CustomerUpdateKycDetailsComponent', () => {
  let component: CustomerUpdateKycDetailsComponent;
  let fixture: ComponentFixture<CustomerUpdateKycDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerUpdateKycDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerUpdateKycDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
