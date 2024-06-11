import { TestBed } from '@angular/core/testing';

import { FxdCommonfunctionsService } from './fxd-commonfunctions.service';

describe('FxdCommonfunctionsService', () => {
  let service: FxdCommonfunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FxdCommonfunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
