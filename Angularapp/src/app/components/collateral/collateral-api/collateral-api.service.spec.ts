import { TestBed } from '@angular/core/testing';

import { CollateralApiService } from './collateral-api.service';

describe('CollateralApiService', () => {
  let service: CollateralApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollateralApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
