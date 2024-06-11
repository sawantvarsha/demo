import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxPivotComponent } from './fx-pivot.component';

describe('FxPivotComponent', () => {
  let component: FxPivotComponent;
  let fixture: ComponentFixture<FxPivotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxPivotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxPivotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
