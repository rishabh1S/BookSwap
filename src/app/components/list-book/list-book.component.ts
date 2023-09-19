import { Component, OnDestroy } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.css'],
})
export class ListBookComponent implements OnDestroy {
  bookForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    author: ['', [Validators.required]],
    description: [''],
    condition: ['', [Validators.required]],
    isbn: ['', [Validators.required, Validators.pattern(/^\d{10,13}$/)]],
  });

  private authStateSubscription: Subscription | undefined;

  constructor(
    private firestore: Firestore,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  addBook() {
    if (this.bookForm.invalid) {
      this.toastr.error(
        'Please fill out all required fields and correct any errors.',
        'Error'
      );
      return;
    }

    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }

    this.authStateSubscription = this.afAuth.authState.subscribe((user) => {
      if (user) {
        const userUID = user.uid;
        const bookDataWithUID = { ...this.bookForm.value, userUID };
        const bookInstance = collection(this.firestore, 'books');
        addDoc(bookInstance, bookDataWithUID)
          .then(() => {
            console.log('Data Added Successfully');
            this.toastr.success('Book added successfully', 'Success');
            this.bookForm.reset();
          })
          .catch((err) => {
            console.log(err.message);
            this.toastr.error(
              'An error occurred while adding the book',
              'Error'
            );
          })
          .finally(() => {
            if (this.authStateSubscription) {
              this.authStateSubscription.unsubscribe();
            }
          });
      }
    });
  }

  ngOnDestroy() {
    if (this.authStateSubscription) {
      this.authStateSubscription.unsubscribe();
    }
  }
}
