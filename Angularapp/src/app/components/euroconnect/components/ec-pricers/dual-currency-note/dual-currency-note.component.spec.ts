import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DualCurrencyNoteComponent } from './dual-currency-note.component';

describe('DualCurrencyNoteComponent', () => {
  let component: DualCurrencyNoteComponent;
  let fixture: ComponentFixture<DualCurrencyNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DualCurrencyNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DualCurrencyNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
