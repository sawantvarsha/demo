import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecumulatorComponent } from './decumulator.component';

describe('DecumulatorComponent', () => {
  let component: DecumulatorComponent;
  let fixture: ComponentFixture<DecumulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecumulatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecumulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
