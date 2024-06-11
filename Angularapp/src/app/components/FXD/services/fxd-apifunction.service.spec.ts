import { TestBed } from '@angular/core/testing';

import { FxdApifunctionService } from './fxd-apifunction.service';

describe('FxdApifunctionService', () => {
  let service: FxdApifunctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FxdApifunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
