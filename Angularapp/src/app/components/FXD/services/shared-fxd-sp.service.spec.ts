import { TestBed } from '@angular/core/testing';

import { SharedFxdSpService } from './shared-fxd-sp.service';

describe('SharedFxdSpService', () => {
  let service: SharedFxdSpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedFxdSpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
