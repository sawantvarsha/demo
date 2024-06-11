import { TestBed } from '@angular/core/testing';

import { KiAndWorstOfPerformanceService } from './wof-and-ki-filter.service';

describe('KiAndWorstOfPerformanceService', () => {
  let service: KiAndWorstOfPerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KiAndWorstOfPerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
