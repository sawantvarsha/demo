import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSetupEditProfileComponent } from './customer-setup-edit-profile.component';

describe('CustomerSetupEditProfileComponent', () => {
  let component: CustomerSetupEditProfileComponent;
  let fixture: ComponentFixture<CustomerSetupEditProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSetupEditProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSetupEditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
