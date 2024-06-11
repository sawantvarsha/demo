import { TestBed } from '@angular/core/testing';

import { EqcApifunctionService } from './eqc-apifunction.service';

describe('EqcApifunctionService', () => {
  let service: EqcApifunctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EqcApifunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
