import { TestBed } from '@angular/core/testing';

import { WorkflowblotterService } from './workflowblotter.service';

describe('WorkflowblotterService', () => {
  let service: WorkflowblotterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkflowblotterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
