import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlyRedemptionComponent } from './early-redemption.component';

describe('EarlyRedemptionComponent', () => {
  let component: EarlyRedemptionComponent;
  let fixture: ComponentFixture<EarlyRedemptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarlyRedemptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarlyRedemptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
