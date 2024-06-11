import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturingtransactionComponent } from './maturingtransaction.component';

describe('MaturingtransactionComponent', () => {
  let component: MaturingtransactionComponent;
  let fixture: ComponentFixture<MaturingtransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaturingtransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturingtransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
