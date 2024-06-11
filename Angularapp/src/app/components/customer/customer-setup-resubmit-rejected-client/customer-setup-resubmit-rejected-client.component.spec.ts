import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSetupResubmitRejectedClientComponent } from './customer-setup-resubmit-rejected-client.component';

describe('CustomerSetupResubmitRejectedClientComponent', () => {
  let component: CustomerSetupResubmitRejectedClientComponent;
  let fixture: ComponentFixture<CustomerSetupResubmitRejectedClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSetupResubmitRejectedClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSetupResubmitRejectedClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
