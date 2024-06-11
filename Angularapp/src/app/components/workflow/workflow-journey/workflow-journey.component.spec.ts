import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowJourneyComponent } from './workflow-journey.component';

describe('WorkflowJourneyComponent', () => {
  let component: WorkflowJourneyComponent;
  let fixture: ComponentFixture<WorkflowJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowJourneyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
