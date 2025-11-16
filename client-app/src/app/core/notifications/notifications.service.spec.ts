import { TestBed } from '@angular/core/testing';

import { CoreNotificationsService } from './notifications.service';

describe('AppToastrService', () => {
  let service: CoreNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
