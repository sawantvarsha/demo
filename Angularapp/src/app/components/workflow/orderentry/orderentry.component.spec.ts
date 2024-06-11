import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderentryComponent } from './orderentry.component';

describe('OrderentryComponent', () => {
  let component: OrderentryComponent;
  let fixture: ComponentFixture<OrderentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
