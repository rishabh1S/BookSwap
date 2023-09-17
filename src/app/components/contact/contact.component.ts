import { Component } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  contactForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    subject: [''],
    message: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private toastr: ToastrService
  ) {}

  submitForm() {
    if (this.contactForm.invalid) {
      this.toastr.error(
        'Please fill out all required fields and correct any errors.',
        'Error'
      );
      return;
    }
    const formData = this.contactForm.value;
    const messageInstance = collection(this.firestore, 'messages');
    addDoc(messageInstance, formData)
      .then(() => {
        console.log('Message Send Successfully');
        this.toastr.success('Message sent successfully!', 'Success');
        this.contactForm.reset();
      })
      .catch((err) => {
        console.log(err.message);
        this.toastr.error(
          'An error occurred while sending the message.',
          'Error'
        );
      });
  }
}
