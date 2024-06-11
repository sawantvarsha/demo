import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LimitorderComponent } from './limitorder.component';

describe('LimitorderComponent', () => {
  let component: LimitorderComponent;
  let fixture: ComponentFixture<LimitorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LimitorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LimitorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
