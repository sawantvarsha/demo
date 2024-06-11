import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderplacementpopupComponent } from './orderplacementpopup.component';

describe('OrderplacementpopupComponent', () => {
  let component: OrderplacementpopupComponent;
  let fixture: ComponentFixture<OrderplacementpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderplacementpopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderplacementpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
