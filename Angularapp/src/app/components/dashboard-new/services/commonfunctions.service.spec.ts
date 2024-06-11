import { TestBed } from '@angular/core/testing';

import { CommonfunctionsService } from './commonfunctions.service';

describe('CommonfunctionsService', () => {
  let service: CommonfunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonfunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
