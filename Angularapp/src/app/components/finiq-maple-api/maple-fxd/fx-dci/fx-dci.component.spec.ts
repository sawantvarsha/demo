import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxDciComponent } from './fx-dci.component';

describe('FxDciComponent', () => {
  let component: FxDciComponent;
  let fixture: ComponentFixture<FxDciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxDciComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxDciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
