import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxTransactionsAbnComponent } from './fx-transactions-abn.component';

describe('FxTransactionsAbnComponent', () => {
  let component: FxTransactionsAbnComponent;
  let fixture: ComponentFixture<FxTransactionsAbnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxTransactionsAbnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxTransactionsAbnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
