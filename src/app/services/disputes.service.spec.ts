import { TestBed } from '@angular/core/testing';

import { Disputes.ServiceService } from './disputes.service.service';

describe('Disputes.ServiceService', () => {
  let service: Disputes.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Disputes.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
