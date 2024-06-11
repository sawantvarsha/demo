import { TestBed } from '@angular/core/testing';

import { PreviousQuotesService } from './previous-quotes.service';

describe('PreviousQuotesService', () => {
  let service: PreviousQuotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreviousQuotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
