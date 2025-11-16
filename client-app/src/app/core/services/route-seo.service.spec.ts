import { TestBed } from '@angular/core/testing';

import { RouteSeoService } from './route-seo.service';

describe('UtilitiesService', () => {
  let service: RouteSeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteSeoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
