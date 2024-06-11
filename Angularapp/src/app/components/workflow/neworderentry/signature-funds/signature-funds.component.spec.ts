import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignatureFundsComponent } from './signature-funds.component';

describe('SignatureFundsComponent', () => {
  let component: SignatureFundsComponent;
  let fixture: ComponentFixture<SignatureFundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignatureFundsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignatureFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
