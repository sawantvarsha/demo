import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxlimitTradesComponent } from './fxlimit-trades.component';

describe('FxlimitTradesComponent', () => {
  let component: FxlimitTradesComponent;
  let fixture: ComponentFixture<FxlimitTradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxlimitTradesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxlimitTradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
