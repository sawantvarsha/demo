import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxDqComponent } from './fx-dq.component';

describe('FxDqComponent', () => {
  let component: FxDqComponent;
  let fixture: ComponentFixture<FxDqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxDqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxDqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
