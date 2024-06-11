import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWatchlistComponent } from './product-watchlist.component';

describe('ProductWatchlistComponent', () => {
  let component: ProductWatchlistComponent;
  let fixture: ComponentFixture<ProductWatchlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductWatchlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
