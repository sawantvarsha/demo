import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerViewKycDetailsComponent } from './customer-view-kyc-details.component';

describe('CustomerViewKycDetailsComponent', () => {
  let component: CustomerViewKycDetailsComponent;
  let fixture: ComponentFixture<CustomerViewKycDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerViewKycDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerViewKycDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
