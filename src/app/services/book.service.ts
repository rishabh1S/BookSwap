import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) {}

  getBookDetailsByISBN(isbn: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?q=isbn:${isbn}`);
  }
}
