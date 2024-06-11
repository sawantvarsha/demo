import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFindSuitableProductComponent } from './customer-find-suitable-product.component';

describe('CustomerFindSuitableProductComponent', () => {
  let component: CustomerFindSuitableProductComponent;
  let fixture: ComponentFixture<CustomerFindSuitableProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerFindSuitableProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerFindSuitableProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
