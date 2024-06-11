import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxaqdqMultiRequestComponent } from './fxaqdq-multi-request.component';

describe('FxaqdqMultiRequestComponent', () => {
  let component: FxaqdqMultiRequestComponent;
  let fixture: ComponentFixture<FxaqdqMultiRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxaqdqMultiRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxaqdqMultiRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
