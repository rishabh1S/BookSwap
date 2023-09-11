import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css'],
})
export class AuthModalComponent {
  emailLogin = '';
  passwordLogin = '';
  emailRegister = '';
  passwordRegister = '';
  confirmPassword = '';
  name = '';
  @Input() showModal!: boolean;
  @Output() closeModal = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  async register() {
    if (this.passwordRegister !== this.confirmPassword) {
      console.error('Passwords do not match.');
      return;
    }
    const { emailRegister, passwordRegister } = this;
    const userCredential = await this.authService.register(
      emailRegister,
      passwordRegister
    );
    this.handleAuthResult(userCredential, 'Registration');
  }

  async login() {
    const { emailLogin, passwordLogin } = this;
    const userCredential = await this.authService.login(
      emailLogin,
      passwordLogin
    );
    this.handleAuthResult(userCredential, 'Login');
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      console.log('Google Sign-In successful:', result);
      this.router.navigate(['/bookStore']);
    } catch (error) {
      console.error('Google Sign-In failed:', error);
    }
  }

  private handleAuthResult(userCredential: any, action: string) {
    if (userCredential) {
      console.log(`${action} successful:`, userCredential.user);
      this.router.navigate(['/bookStore']);
    } else {
      console.error(`${action} failed.`);
    }
  }
}
