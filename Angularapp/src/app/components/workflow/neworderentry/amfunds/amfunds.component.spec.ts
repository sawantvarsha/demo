import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmfundsComponent } from './amfunds.component';

describe('AmfundsComponent', () => {
  let component: AmfundsComponent;
  let fixture: ComponentFixture<AmfundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmfundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmfundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
