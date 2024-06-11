import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSetupViewCpraDetailsComponent } from './customer-setup-view-cpra-details.component';

describe('CustomerSetupViewCpraDetailsComponent', () => {
  let component: CustomerSetupViewCpraDetailsComponent;
  let fixture: ComponentFixture<CustomerSetupViewCpraDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSetupViewCpraDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSetupViewCpraDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
