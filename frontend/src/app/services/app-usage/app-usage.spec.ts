import { TestBed } from '@angular/core/testing';

import { AppUsage } from './app-usage';

describe('AppUsage', () => {
  let service: AppUsage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppUsage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
