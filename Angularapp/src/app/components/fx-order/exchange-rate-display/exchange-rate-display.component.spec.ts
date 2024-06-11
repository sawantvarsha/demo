import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeRateDisplayComponent } from './exchange-rate-display.component';

describe('ExchangeRateDisplayComponent', () => {
  let component: ExchangeRateDisplayComponent;
  let fixture: ComponentFixture<ExchangeRateDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExchangeRateDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeRateDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
