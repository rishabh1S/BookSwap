import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { generateUsername } from 'unique-username-generator';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';

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
  showPassword: boolean = false;
  isFocused1: boolean = false;
  isFocused2: boolean = false;
  @Input() showModal!: boolean;
  @Output() closeModal = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: Firestore,
    private toastr: ToastrService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async generateRandomUsernameAndAvatar() {
    const username = generateUsername('', 0, 10);
    let avatarUrl = '';

    try {
      const avatarResponse = await axios.get(
        `https://api.dicebear.com/7.x/micah/svg?flip=true&backgroundType=gradientLinear&backgroundRotation[]&baseColor=f9c9b6,ac6651&earringsProbability=15&facialHair=scruff&facialHairProbability=30&hair=dannyPhantom,fonze,full,pixie,turban,mrClean&hairProbability=95&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&seed=${username}`
      );
      avatarUrl = avatarResponse.request.responseURL;
    } catch (error) {
      console.error('API request failed:', error);
      avatarUrl =
        'https://res.cloudinary.com/dnp36kqdc/image/upload/v1694805447/user_s2emcd.png';
    }
    return { username, avatarUrl };
  }

  async register() {
    if (this.passwordRegister !== this.confirmPassword) {
      console.error('Passwords do not match.');
      this.toastr.warning('Passwords do not match!', 'Error');
      return;
    }
    const { emailRegister, passwordRegister } = this;
    try {
      // Register the user with Firebase Authentication
      const userCredential = await this.authService.register(
        emailRegister,
        passwordRegister
      );

      if (userCredential && userCredential.user) {
        const userUID = userCredential.user.uid;
        const userEmail = userCredential.user.email;

        const { username, avatarUrl } =
          await this.generateRandomUsernameAndAvatar();

        // Store user data in Firestore
        const userData = {
          username,
          avatarUrl,
          userUID,
          userEmail,
          firstName: '',
          lastName: '',
          gender: '',
          location: '',
          birthday: '',
          summary: '',
          instaId: '',
          twitterId: '',
        };

        // Store user data in Firestore's 'users' collection
        const userInstance = collection(this.firestore, 'users');
        await addDoc(userInstance, userData);

        console.log(
          'User registered successfully with random username and avatar.'
        );
        this.toastr.success('User registered successfully!', 'Success');
        this.handleAuthResult(userCredential, 'Registration');
      }
    } catch (error) {
      console.error('Registration error:', error);
      this.toastr.error('An error occurred while registering', 'Error');
    }
  }

  async login() {
    const { emailLogin, passwordLogin } = this;
    const userCredential = await this.authService.login(
      emailLogin,
      passwordLogin
    );
    this.handleAuthResult(userCredential, 'Login');
  }

  async signUpWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      console.log('Google Sign-In successful:', result);

      // Check if the user is new (just registered)
      if (result.additionalUserInfo?.isNewUser) {
        const user = result.user;

        if (user) {
          const { username, avatarUrl } =
            await this.generateRandomUsernameAndAvatar();

          const userEmail = user.email;
          // Store user data in Firestore
          const userData = {
            username,
            avatarUrl,
            userUID: user.uid,
            userEmail,
            firstName: '',
            lastName: '',
            gender: '',
            location: '',
            birthday: '',
            summary: '',
            instaId: '',
            twitterId: '',
          };

          // Store user data in Firestore's 'users' collection
          const userInstance = collection(this.firestore, 'users');
          await addDoc(userInstance, userData);

          console.log(
            'User registered with Google with random username and avatar.'
          );
          this.toastr.success(
            'User registered successfully with Google',
            'Success'
          );
        }
        this.router.navigate(['/bookStore']);
      }
    } catch (error) {
      console.error('Google Sign-Up failed:', error);
      this.toastr.error('Google Sign-Up failed', 'Error');
    }
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      console.log('Google Sign-In successful:', result);
      this.router.navigate(['/bookStore']);
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      this.toastr.error('Google Sign-In failed', 'Error');
    }
  }

  private handleAuthResult(userCredential: any, action: string) {
    if (userCredential) {
      console.log(`${action} successful:`, userCredential.user);
      this.router.navigate(['/bookStore']);
    } else {
      console.error(`${action} failed.`);
      this.toastr.error('Something Went Wrong', 'Error');
    }
  }
}
