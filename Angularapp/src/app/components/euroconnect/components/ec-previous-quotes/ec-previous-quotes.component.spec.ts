import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcPreviousQuotesComponent } from './ec-previous-quotes.component';

describe('EcPreviousQuotesComponent', () => {
  let component: EcPreviousQuotesComponent;
  let fixture: ComponentFixture<EcPreviousQuotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcPreviousQuotesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EcPreviousQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
