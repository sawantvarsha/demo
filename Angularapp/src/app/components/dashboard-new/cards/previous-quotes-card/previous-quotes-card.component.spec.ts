import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousQuotesCardComponent } from './previous-quotes-card.component';

describe('PreviousQuotesCardComponent', () => {
  let component: PreviousQuotesCardComponent;
  let fixture: ComponentFixture<PreviousQuotesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviousQuotesCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousQuotesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
