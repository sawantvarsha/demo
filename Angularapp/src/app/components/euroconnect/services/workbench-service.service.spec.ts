import { TestBed } from '@angular/core/testing';

import { WorkbenchServiceService } from './workbench-service.service';

describe('WorkbenchServiceService', () => {
  let service: WorkbenchServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkbenchServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
