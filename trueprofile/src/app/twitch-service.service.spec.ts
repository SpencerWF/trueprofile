import { TestBed } from '@angular/core/testing';

import { TwitchService } from './twitch-service.service';

describe('TwitchServiceService', () => {
  let service: TwitchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwitchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
