import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../interfaces/index';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private fs: AngularFirestore
  ) { }

  createUser(user: User) {
    return this.fs.collection('user_data').doc(user.uid).set(user);
  }

  searchGame() {
    return this.fs.collection('games', ref => ref.where('userO', '==', 'null'));
  }

  createGame(data: any) {
    return this.fs.collection('games').add({userX: data, userO: 'null'});
  }
}
