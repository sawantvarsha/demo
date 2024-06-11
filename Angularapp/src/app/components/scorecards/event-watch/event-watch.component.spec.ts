import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventWatchComponent } from './event-watch.component';

describe('EventWatchComponent', () => {
  let component: EventWatchComponent;
  let fixture: ComponentFixture<EventWatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventWatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
