import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPriorityComponent } from './display-priority.component';

describe('DisplayPriorityComponent', () => {
  let component: DisplayPriorityComponent;
  let fixture: ComponentFixture<DisplayPriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayPriorityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
