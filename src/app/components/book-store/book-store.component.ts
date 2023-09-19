import { Component, OnInit } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BookService } from 'src/app/services/book.service';
import { BookDetailComponent } from '../book-detail/book-detail.component';
import { ToastrService } from 'ngx-toastr';

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
  currentUserUID: any;

  constructor(
    private firestore: Firestore,
    private authService: AuthService,
    private router: Router,
    private googleBooksApiService: BookService,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService
  ) {
    this.getData();

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.currentUserUID = user.uid;
      }
    });
  }

  getData() {
    const bookInstance = collection(this.firestore, 'books');
    getDocs(bookInstance).then((res) => {
      this.books = res.docs.map((item) => {
        return { ...item.data(), id: item.id };
      });

      // Fetch additional book details including cover image
      this.books.forEach((book) => {
        this.googleBooksApiService
          .getBookDetailsByISBN(book.isbn)
          .subscribe((data) => {
            const volumeInfo = data.items[0].volumeInfo;
            book.coverImage = volumeInfo.imageLinks?.thumbnail;
          });
      });

      this.filteredBooks = this.books.filter((book) => {
        return book.userUID !== this.currentUserUID;
      });
    });
  }

  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  logout() {
    this.authService.signOut().then(() => {
      this.currentUserUID = null;
      console.log('Logout Successfull');
      this.toastr.success('Logged out successfully!', 'Success');
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
      return (
        (titleMatch || authorMatch) && book.userUID !== this.currentUserUID
      );
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

  profileManagement() {
    this.router.navigate(['/profile', this.currentUserUID]);
  }
}
