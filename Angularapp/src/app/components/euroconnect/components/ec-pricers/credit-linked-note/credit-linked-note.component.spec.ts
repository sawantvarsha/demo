import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditLinkedNoteComponent } from './credit-linked-note.component';

describe('CreditLinkedNoteComponent', () => {
  let component: CreditLinkedNoteComponent;
  let fixture: ComponentFixture<CreditLinkedNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditLinkedNoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditLinkedNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
