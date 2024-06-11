import { TestBed } from '@angular/core/testing';

import { ApifunctionsService } from './apifunctions.service';

describe('ApifunctionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApifunctionsService = TestBed.get(ApifunctionsService);
    expect(service).toBeTruthy();
  });
});
