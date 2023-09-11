import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = afAuth.authState as Observable<firebase.User | null>;
  }

  async register(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential | null> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      return userCredential;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential | null> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.afAuth.currentUser;
  }

  // Get the current user
  getCurrentUser() {
    return this.afAuth.currentUser;
  }

  // Sign out the user
  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }
}
