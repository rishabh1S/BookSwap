import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
})
export class BookDetailComponent implements OnInit {
  @Input() isbn!: string;
  @Input() ownerUid!: string;
  @Output() closeModalEvent = new EventEmitter<void>();
  bookDetails: any;
  isModalOpen: boolean = true;

  constructor(
    private googleBooksApiService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch book details based on ISBN when the modal is opened
    this.googleBooksApiService
      .getBookDetailsByISBN(this.isbn)
      .subscribe((data) => {
        this.bookDetails = data.items[0];
      });
  }

  closeModal() {
    this.isModalOpen = false;
    this.closeModalEvent.emit();
  }

  contactUser() {
    this.router.navigate(['/chat', this.ownerUid]);
  }
}
