import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxOptionComponent } from './fx-option.component';

describe('FxOptionComponent', () => {
  let component: FxOptionComponent;
  let fixture: ComponentFixture<FxOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
