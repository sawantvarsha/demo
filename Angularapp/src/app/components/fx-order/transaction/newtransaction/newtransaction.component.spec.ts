import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewtransactionComponent } from './newtransaction.component';

describe('NewtransactionComponent', () => {
  let component: NewtransactionComponent;
  let fixture: ComponentFixture<NewtransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewtransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewtransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
