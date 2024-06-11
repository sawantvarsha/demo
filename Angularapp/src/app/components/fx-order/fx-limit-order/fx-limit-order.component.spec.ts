import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxLimitOrderComponent } from './fx-limit-order.component';

describe('FxLimitOrderComponent', () => {
  let component: FxLimitOrderComponent;
  let fixture: ComponentFixture<FxLimitOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxLimitOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxLimitOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
