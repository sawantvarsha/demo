import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FxCardComponent } from './fx-card.component';

describe('FxCardComponent', () => {
  let component: FxCardComponent;
  let fixture: ComponentFixture<FxCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FxCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
