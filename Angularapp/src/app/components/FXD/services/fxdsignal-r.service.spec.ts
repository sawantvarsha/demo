import { TestBed } from '@angular/core/testing';

import { FXDSignalRService } from './fxdsignal-r.service';

describe('FXDSignalRService', () => {
  let service: FXDSignalRService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FXDSignalRService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
