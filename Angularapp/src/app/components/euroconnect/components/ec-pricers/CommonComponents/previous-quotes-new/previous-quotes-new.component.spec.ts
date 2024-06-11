import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousQuotesNewComponent } from './previous-quotes-new.component';

describe('PreviousQuotesNewComponent', () => {
  let component: PreviousQuotesNewComponent;
  let fixture: ComponentFixture<PreviousQuotesNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviousQuotesNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousQuotesNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
