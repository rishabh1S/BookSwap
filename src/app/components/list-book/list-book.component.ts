import { Component } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-list-book',
  templateUrl: './list-book.component.html',
  styleUrls: ['./list-book.component.css'],
})
export class ListBookComponent {
  constructor(private firestore: Firestore, private afAuth: AngularFireAuth) {}

  book = {
    title: '',
    author: '',
    condition: '',
    description: '',
    isbn: '',
    uid: '',
  };

  addBook(bookForm: NgForm) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        const userUID = user.uid;
        const bookDataWithUID = { ...bookForm.value, userUID };
        const bookInstance = collection(this.firestore, 'books');
        addDoc(bookInstance, bookDataWithUID)
          .then(() => {
            console.log('Data Added Successfully');
            bookForm.resetForm();
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    });
  }
}
