import { TestBed } from '@angular/core/testing';

import { SpPortfolioSnapshotService } from './sp-portfolio-snapshot.service';

describe('SpPortfolioSnapshotService', () => {
  let service: SpPortfolioSnapshotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpPortfolioSnapshotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
