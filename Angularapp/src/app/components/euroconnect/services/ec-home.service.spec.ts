import { TestBed } from '@angular/core/testing';

import { EcHomeService } from './ec-home.service';

describe('EcHomeService', () => {
  let service: EcHomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcHomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
