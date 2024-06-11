import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledRequestsComponent } from './scheduled-requests.component';

describe('ScheduledRequestsComponent', () => {
  let component: ScheduledRequestsComponent;
  let fixture: ComponentFixture<ScheduledRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduledRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
