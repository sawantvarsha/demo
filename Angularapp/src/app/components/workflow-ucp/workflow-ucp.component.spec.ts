import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowUCPComponent } from './workflow-ucp.component';

describe('WorkflowUCPComponent', () => {
  let component: WorkflowUCPComponent;
  let fixture: ComponentFixture<WorkflowUCPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkflowUCPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowUCPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
