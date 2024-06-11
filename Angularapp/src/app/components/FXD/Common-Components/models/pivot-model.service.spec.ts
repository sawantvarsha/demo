import { TestBed } from '@angular/core/testing';

import { PivotModelService } from './pivot-model.service';

describe('PivotModelService', () => {
  let service: PivotModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PivotModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
