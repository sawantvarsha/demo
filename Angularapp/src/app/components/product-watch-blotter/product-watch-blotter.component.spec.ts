import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductWatchBlotterComponent } from './product-watch-blotter.component';

describe('ProductWatchBlotterComponent', () => {
  let component: ProductWatchBlotterComponent;
  let fixture: ComponentFixture<ProductWatchBlotterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductWatchBlotterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductWatchBlotterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
