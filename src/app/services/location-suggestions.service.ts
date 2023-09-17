import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LocationSuggestionsService {
  constructor(private http: HttpClient) {}

  getLocationSuggestions(query: string) {
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`;
    return this.http.get(apiUrl);
  }
}
