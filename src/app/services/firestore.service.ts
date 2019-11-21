import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User, Game } from '../interfaces/index';

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

  searchGame(type: string) {
    return this.fs.collection('games', ref => ref.where(type, '==', 'null'));
  }

  searchGameX(uid: string) {
    return this.fs.collection('games', ref => ref.where('userX.uid', '==', uid));
  }

  createGame(data: any) {
    return this.fs.collection('games').add({
      userX: data,
      userO: 'null',
      squares: Array(9).fill(null),
      xIsNext: true,
      winner: 'null',
      active: true
    });
  }

  getUsersActive() {
    return this.fs.collection('user_data');
  }

  getUsersScore() {
    return this.fs.collection('scores');
  }

  watchGame(id: string) {
    return this.fs.collection('games').doc(id);
  }

  updateGame(game: Game) {
    return this.fs.collection('games').doc(game.id).update(game);
  }
}
