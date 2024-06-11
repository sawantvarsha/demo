import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxbarrierMultiRequestComponent } from './fxbarrier-multi-request.component';

describe('FxbarrierMultiRequestComponent', () => {
  let component: FxbarrierMultiRequestComponent;
  let fixture: ComponentFixture<FxbarrierMultiRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxbarrierMultiRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxbarrierMultiRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
