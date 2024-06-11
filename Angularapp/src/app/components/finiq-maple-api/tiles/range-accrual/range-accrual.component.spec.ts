import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeAccrualComponent } from './range-accrual.component';

describe('RangeAccrualComponent', () => {
  let component: RangeAccrualComponent;
  let fixture: ComponentFixture<RangeAccrualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RangeAccrualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeAccrualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
