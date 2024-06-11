import { TestBed } from '@angular/core/testing';

import { AudittrailService } from './audittrail.service';

describe('AudittrailService', () => {
  let service: AudittrailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudittrailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
