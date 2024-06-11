import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowblotterComponent } from './workflowblotter.component';

describe('WorkflowblotterComponent', () => {
  let component: WorkflowblotterComponent;
  let fixture: ComponentFixture<WorkflowblotterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowblotterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowblotterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
