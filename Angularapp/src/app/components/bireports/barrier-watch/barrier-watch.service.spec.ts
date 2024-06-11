import { TestBed } from '@angular/core/testing';

import { BarrierWatchService } from './barrier-watch.service';

describe('BarrierWatchService', () => {
  let service: BarrierWatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarrierWatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
