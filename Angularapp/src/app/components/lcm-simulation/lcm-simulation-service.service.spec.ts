import { TestBed } from '@angular/core/testing';

import { LcmSimulationServiceService } from './lcm-simulation-service.service';

describe('LcmSimulationServiceService', () => {
  let service: LcmSimulationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LcmSimulationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
