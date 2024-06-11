import { TestBed } from '@angular/core/testing';

import { MapleAPIService } from './maple-api.service';

describe('MapleAPIService', () => {
  let service: MapleAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapleAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
