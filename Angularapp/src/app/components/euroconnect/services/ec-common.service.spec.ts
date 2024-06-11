import { TestBed } from '@angular/core/testing';

import { EcCommonService } from './ec-common.service';

describe('EcCommonService', () => {
  let service: EcCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
