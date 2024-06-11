import { TestBed } from '@angular/core/testing';

import { PricersService } from './pricers.service';

describe('PricersService', () => {
  let service: PricersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PricersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
