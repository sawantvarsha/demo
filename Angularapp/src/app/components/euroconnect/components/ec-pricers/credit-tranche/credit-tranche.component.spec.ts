import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditTrancheComponent } from './credit-tranche.component';

describe('CreditTrancheComponent', () => {
  let component: CreditTrancheComponent;
  let fixture: ComponentFixture<CreditTrancheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditTrancheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditTrancheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
