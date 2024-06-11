import { TestBed } from '@angular/core/testing';

import { MultirequestService } from './multirequest.service';

describe('MultirequestService', () => {
  let service: MultirequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultirequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
