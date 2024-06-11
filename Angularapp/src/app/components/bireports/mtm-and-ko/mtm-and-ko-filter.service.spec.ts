import { TestBed } from '@angular/core/testing';

import { MtmAndKoFilterService } from './mtm-and-ko-filter.service';

describe('MtmAndKoFilterService', () => {
  let service: MtmAndKoFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MtmAndKoFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
