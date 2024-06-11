import { TestBed } from '@angular/core/testing';

import { BarrierProbabilityService } from './barrier-probability.service';

describe('BarrierProbabilityService', () => {
  let service: BarrierProbabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarrierProbabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
