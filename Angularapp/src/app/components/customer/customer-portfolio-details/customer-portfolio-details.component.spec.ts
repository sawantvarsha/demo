import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPortfolioDetailsComponent } from './customer-portfolio-details.component';

describe('CustomerPortfolioDetailsComponent', () => {
  let component: CustomerPortfolioDetailsComponent;
  let fixture: ComponentFixture<CustomerPortfolioDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerPortfolioDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPortfolioDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
