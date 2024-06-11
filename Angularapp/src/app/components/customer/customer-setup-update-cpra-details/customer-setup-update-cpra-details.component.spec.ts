import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSetupUpdateCpraDetailsComponent } from './customer-setup-update-cpra-details.component';

describe('CustomerSetupUpdateCpraDetailsComponent', () => {
  let component: CustomerSetupUpdateCpraDetailsComponent;
  let fixture: ComponentFixture<CustomerSetupUpdateCpraDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSetupUpdateCpraDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSetupUpdateCpraDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
