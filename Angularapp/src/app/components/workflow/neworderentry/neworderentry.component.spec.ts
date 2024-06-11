import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeworderentryComponent } from './neworderentry.component';

describe('NeworderentryComponent', () => {
  let component: NeworderentryComponent;
  let fixture: ComponentFixture<NeworderentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeworderentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeworderentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
