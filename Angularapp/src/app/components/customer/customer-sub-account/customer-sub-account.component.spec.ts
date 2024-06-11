import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSubAccountComponent } from './customer-sub-account.component';

describe('CustomerSubAccountComponent', () => {
  let component: CustomerSubAccountComponent;
  let fixture: ComponentFixture<CustomerSubAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSubAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSubAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
