import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxOrderAbnComponent } from './fx-order-abn.component';

describe('FxOrderAbnComponent', () => {
  let component: FxOrderAbnComponent;
  let fixture: ComponentFixture<FxOrderAbnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxOrderAbnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxOrderAbnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
