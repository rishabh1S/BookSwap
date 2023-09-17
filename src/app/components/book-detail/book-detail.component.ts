import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { Router } from '@angular/router';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';

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
  ownerAvatarUrl: string = '';
  ownerUsername: string = '';

  constructor(
    private googleBooksApiService: BookService,
    private router: Router,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    // Fetch book details based on ISBN when the modal is opened
    this.googleBooksApiService
      .getBookDetailsByISBN(this.isbn)
      .subscribe((data) => {
        this.bookDetails = data.items[0];
      });

    this.fetchOwnerData();
  }

  closeModal() {
    this.isModalOpen = false;
    this.closeModalEvent.emit();
  }

  viewUser() {
    this.router.navigate(['/profile', this.ownerUid]);
  }

  async fetchOwnerData() {
    try {
      const userCollectionRef = collection(this.firestore, 'users');
      const q = query(userCollectionRef, where('userUID', '==', this.ownerUid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        this.ownerAvatarUrl = userData['avatarUrl'];
        this.ownerUsername = userData['username'];
      } else {
        console.log('Owner user not found in the database');
      }
    } catch (error) {
      console.error('Error fetching owner data:', error);
    }
  }
}
