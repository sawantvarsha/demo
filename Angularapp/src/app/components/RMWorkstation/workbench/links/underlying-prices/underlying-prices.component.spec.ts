import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnderlyingPricesComponent } from './underlying-prices.component';

describe('UnderlyingPricesComponent', () => {
  let component: UnderlyingPricesComponent;
  let fixture: ComponentFixture<UnderlyingPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnderlyingPricesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnderlyingPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
