import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSetupViewComponent } from './customer-setup-view.component';

describe('CustomerSetupViewComponent', () => {
  let component: CustomerSetupViewComponent;
  let fixture: ComponentFixture<CustomerSetupViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSetupViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSetupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
