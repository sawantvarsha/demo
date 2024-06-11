import { TestBed } from '@angular/core/testing';

import { FXDConfigService } from './fxd-config.service';

describe('FXDConfigService', () => {
  let service: FXDConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FXDConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
