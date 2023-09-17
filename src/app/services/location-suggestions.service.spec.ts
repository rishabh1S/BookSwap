import { TestBed } from '@angular/core/testing';

import { LocationSuggestionsService } from './location-suggestions.service';

describe('LocationSuggestionsService', () => {
  let service: LocationSuggestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationSuggestionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
