import { TestBed } from '@angular/core/testing';

import { WorkbenchLinksService } from './workbench-links.service';

describe('WorkbenchLinksService', () => {
  let service: WorkbenchLinksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkbenchLinksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
