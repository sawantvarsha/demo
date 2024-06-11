import { TestBed } from '@angular/core/testing';

import { EqcCommonfunctionsService } from './eqc-commonfunctions.service';

describe('EqcCommonfunctionsService', () => {
  let service: EqcCommonfunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EqcCommonfunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
