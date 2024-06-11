import { TestBed } from '@angular/core/testing';

import { ScorecardsService } from './scorecards.service';

describe('ScorecardsService', () => {
  let service: ScorecardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScorecardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
