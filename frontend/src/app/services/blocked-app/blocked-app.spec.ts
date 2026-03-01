import { TestBed } from '@angular/core/testing';

import { BlockedAppService } from './blocked-app';

describe('BlockedApp', () => {
  let service: BlockedAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockedAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
