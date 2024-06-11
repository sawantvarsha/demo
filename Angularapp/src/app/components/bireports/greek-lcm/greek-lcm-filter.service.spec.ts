import { TestBed } from '@angular/core/testing';

import { GreekLcmFilterService } from './greek-lcm-filter.service';

describe('GreekLcmFilterService', () => {
  let service: GreekLcmFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GreekLcmFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
