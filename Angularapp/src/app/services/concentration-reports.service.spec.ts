import { TestBed } from '@angular/core/testing';

import { ConcentrationReportsService } from './concentration-reports.service';

describe('ConcentrationReportsService', () => {
  let service: ConcentrationReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConcentrationReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
