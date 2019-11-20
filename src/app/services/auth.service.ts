import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afa: AngularFireAuth
  ) { }

  signWithGmail() {
    return this.afa.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.afa.auth.signOut();
  }

  getUser() {
    return this.afa.auth.currentUser;
  }
}
