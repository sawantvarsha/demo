import { TestBed } from '@angular/core/testing';

import { ApifunctionService } from './apifunction.service';

describe('ApifunctionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApifunctionService = TestBed.get(ApifunctionService);
    expect(service).toBeTruthy();
  });
});
