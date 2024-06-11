import { TestBed } from '@angular/core/testing';

import { LCMApiService } from './lcmapi.service';

describe('LCMApiService', () => {
  let service: LCMApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LCMApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
