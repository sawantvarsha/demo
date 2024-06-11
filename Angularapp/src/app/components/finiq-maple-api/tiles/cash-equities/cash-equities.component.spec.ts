import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashEquitiesComponent } from './cash-equities.component';

describe('CashEquitiesComponent', () => {
  let component: CashEquitiesComponent;
  let fixture: ComponentFixture<CashEquitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashEquitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashEquitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
