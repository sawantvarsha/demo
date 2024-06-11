import { TestBed } from '@angular/core/testing';

import { MtmAndKiFilterService } from './mtm-and-ki-filter.service';

describe('MtmAndKiFilterService', () => {
  let service: MtmAndKiFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MtmAndKiFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
