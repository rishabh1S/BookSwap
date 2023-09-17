import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute } from '@angular/router';
import { BookService } from 'src/app/services/book.service';
import {
  Firestore,
  collection,
  getDocs,
  where,
  query,
  QuerySnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { LocationSuggestionsService } from '../../services/location-suggestions.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent {
  user: any;
  showUpdateModal: boolean = false;
  showDeleteModal = false;
  currentUserUID!: string;
  locationSuggestions: any[] = [];
  isContactModalOpen = false;
  selectedBookForExchange: any;
  receiverEmail: string = '';
  bookToDelete: any;
  proposedBook: any = {
    title: '',
    author: '',
  };

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: Firestore,
    private route: ActivatedRoute,
    private locationSuggestionsService: LocationSuggestionsService,
    private googleBooksApiService: BookService,
    private toastr: ToastrService
  ) {
    this.retrieveUserData();

    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.currentUserUID = user.uid;
      }
    });
  }

  onLocationInput(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    if (query) {
      this.locationSuggestionsService.getLocationSuggestions(query).subscribe(
        (data: any) => {
          this.locationSuggestions = data;
        },
        (error) => {
          console.error('Error fetching location suggestions:', error);
        }
      );
    } else {
      this.locationSuggestions = [];
    }
  }

  selectLocation(suggestion: any) {
    this.user.location = suggestion.display_name;
    this.locationSuggestions = [];
  }

  private retrieveUserData() {
    this.route.paramMap.subscribe((params) => {
      const userUID = params.get('uid');
      if (userUID) {
        const userCollectionRef = collection(this.firestore, 'users');
        const q = query(userCollectionRef, where('userUID', '==', userUID));

        getDocs(q)
          .then((querySnapshot: QuerySnapshot<any>) => {
            if (!querySnapshot.empty) {
              const userDoc = querySnapshot.docs[0];
              this.user = userDoc.data();

              // Fetch user's listed books
              const booksCollectionRef = collection(this.firestore, 'books');
              const bookQuery = query(
                booksCollectionRef,
                where('userUID', '==', userUID)
              );

              getDocs(bookQuery)
                .then((bookSnapshot: QuerySnapshot<any>) => {
                  if (!bookSnapshot.empty) {
                    this.user.listedBooks = bookSnapshot.docs.map((doc) => {
                      const bookData = doc.data();
                      return { ...bookData, id: doc.id };
                    });
                    // Fetch cover images for listed books
                    this.user.listedBooks.forEach(
                      (book: { isbn: string; coverImage: string }) => {
                        this.googleBooksApiService
                          .getBookDetailsByISBN(book.isbn)
                          .subscribe((data) => {
                            const volumeInfo = data.items[0].volumeInfo;
                            book.coverImage = volumeInfo.imageLinks?.thumbnail;
                          });
                      }
                    );
                  } else {
                    this.user.listedBooks = [];
                  }
                })
                .catch((error) => {
                  console.error("Error fetching user's listed books:", error);
                  this.toastr.error(
                    "An error occurred while fetching user's listed books",
                    'Error'
                  );
                });
            } else {
              console.log('There is no such user in the database!');
              this.toastr.warning(
                'There is no such user in the database!',
                'Warning'
              );
            }
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
            this.toastr.error(
              'An error occurred while fetching user data',
              'Error'
            );
          });
      }
    });
  }

  // Toggle the update modal
  toggleUpdateModal() {
    this.showUpdateModal = !this.showUpdateModal;
  }

  isCurrentUserProfile(): boolean {
    return this.currentUserUID === this.user.userUID;
  }

  showDeleteConfirmationModal(book: any) {
    this.bookToDelete = book; // Store the book to delete
    this.showDeleteModal = true;
  }

  // Method to hide the delete confirmation modal
  hideDeleteModal() {
    this.bookToDelete = null; // Reset the book to delete
    this.showDeleteModal = false;
  }

  proposeBookTrade(book: any) {
    this.proposedBook.title = book.title;
    this.proposedBook.author = book.author;
    const subject = `Book Exchange Proposal: ${this.proposedBook.title}`;
    this.receiverEmail = this.user.userEmail;

    const userCollectionRef = collection(this.firestore, 'users');
    const q = query(
      userCollectionRef,
      where('userUID', '==', this.currentUserUID)
    );

    getDocs(q)
      .then((querySnapshot: QuerySnapshot<any>) => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const currentUser = userDoc.data();

          // Construct the message
          const senderName = `${currentUser.firstName} ${currentUser.lastName}`;
          const receiverName = `${this.user.firstName} ${this.user.lastName}`;

          // Construct the message
          const message = `
          Hi ${receiverName},

          I came across your book, "${this.proposedBook.title}" by "${this.proposedBook.author}" listed on BookSwap, and I'd love to exchange books with you. 
          
          Here are the details of the book I'm willing to offer in exchange:
          Title: [Your Book Title]
          Author: [Your Book Author]
          ISBN: [Your Book ISBN]
          
          Please let me know if you're interested in this exchange.

          Best regards,
          ${senderName}
        `;
          const encodedSubject = encodeURIComponent(subject);
          const encodedMessage = encodeURIComponent(message);

          const mailtoLink = `mailto:${this.receiverEmail}?subject=${encodedSubject}&body=${encodedMessage}`;

          // Open the user's default email client with the mailto link
          window.location.href = mailtoLink;
        }
      })
      .catch((error) => {
        console.error('Error fetching current user data:', error);
        this.toastr.error(
          'An error occurred while fetching current user data',
          'Error'
        );
      });
  }

  // Update user details
  async updateDetails(updateForm: NgForm) {
    const newUserData = {
      firstName: updateForm.value.firstName,
      lastName: updateForm.value.lastName,
      gender: updateForm.value.gender,
      location: updateForm.value.location,
      birthday: updateForm.value.birthday,
      summary: updateForm.value.summary,
      instaId: updateForm.value.instaId,
      twitterId: updateForm.value.twitterId,
    };

    this.route.paramMap.subscribe((params) => {
      const userUID = params.get('uid');
      if (userUID) {
        // Find the user's document based on their userUID
        const userCollectionRef = collection(this.firestore, 'users');
        const q = query(userCollectionRef, where('userUID', '==', userUID));

        getDocs(q)
          .then((querySnapshot: QuerySnapshot<any>) => {
            if (!querySnapshot.empty) {
              // Assuming there is only one matching document
              const userDoc = querySnapshot.docs[0];
              const userDocRef = doc(this.firestore, 'users', userDoc.id);

              // Update the user's document
              updateDoc(userDocRef, newUserData)
                .then(() => {
                  console.log('User details updated successfully');
                  this.toastr.success(
                    'User details updated successfully',
                    'Success'
                  );
                  this.toggleUpdateModal();
                })
                .catch((error) => {
                  console.error('Error updating user details:', error);
                  this.toastr.error(
                    'An error occurred while updating user details',
                    'Error'
                  );
                });
            } else {
              console.log('There is no such user in the database!');
              this.toastr.warning(
                'There is no such user in the database!',
                'Error'
              );
            }
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
            this.toastr.error(
              'An error occurred while fetching user data',
              'Error'
            );
          });
      }
    });
  }

  async deleteBook(book: any) {
    console.log('Deleting book:', book.id);
    try {
      // Remove the book from the user's displayed list
      this.user.listedBooks = this.user.listedBooks.filter(
        (b: any) => b !== book
      );
      // Delete the book document from Firestore
      const bookDocRef = doc(this.firestore, 'books', book.id);
      await deleteDoc(bookDocRef);
      console.log(`"${book.title}" has been deleted.`);
      this.toastr.success('The book has been deleted successfully', 'Success');
    } catch (error) {
      console.error(`Error deleting "${book.title}":`, error);
      this.toastr.error('An error occurred while deleting the book', 'Error');
    }
  }

  confirmDelete() {
    if (this.bookToDelete) {
      this.deleteBook(this.bookToDelete);
      this.hideDeleteModal();
    }
  }
}
