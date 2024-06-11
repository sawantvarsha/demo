import { TestBed } from '@angular/core/testing';

import { KoAndWorstOfPerformanceService } from './wof-and-ko-filter.service';

describe('KiAndWorstOfPerformanceService', () => {
  let service: KoAndWorstOfPerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KoAndWorstOfPerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
