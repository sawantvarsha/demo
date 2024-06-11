import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSetupComponent } from './customer-setup.component';

describe('CustomerSetupComponent', () => {
  let component: CustomerSetupComponent;
  let fixture: ComponentFixture<CustomerSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
