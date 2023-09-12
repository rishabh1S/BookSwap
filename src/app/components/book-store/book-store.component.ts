import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BookService } from 'src/app/services/book.service';
import { BookDetailComponent } from '../book-detail/book-detail.component';

@Component({
  selector: 'app-book-store',
  templateUrl: './book-store.component.html',
  styleUrls: ['./book-store.component.css'],
})
export class BookStoreComponent {
  books: any[] = [];
  isProfileDropdownOpen: boolean = false;
  searchTerm: string = '';
  filteredBooks: any[] = [];
  isModalOpen = false; // Track whether the modal is open
  selectedISBN!: string; // Store the selected book's ISBN
  selectedUserUID!: string;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private router: Router,
    private googleBooksApiService: BookService
  ) {
    this.getData();
  }

  getData() {
    const bookInstance = collection(this.firestore, 'books');
    getDocs(bookInstance).then((res) => {
      this.books = res.docs.map((item) => {
        return { ...item.data(), id: item.id };
      });
      this.filteredBooks = this.books;
    });
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  logout() {
    this.authService.signOut().then(() => {
      console.log('Logout Successfull');
      this.router.navigate(['/']);
    });
  }

  searchBooks() {
    // Filter the books based on the search term
    this.filteredBooks = this.books.filter((book) => {
      const titleMatch = book.title
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const authorMatch = book.author
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      return titleMatch || authorMatch;
    });
  }

  openBookDetailsModal(isbn: string, userUID: string) {
    this.selectedISBN = isbn;
    this.selectedUserUID = userUID;
    this.isModalOpen = true;
    console.log('Modal opened for ISBN:', isbn);
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
