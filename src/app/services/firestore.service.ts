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
    return this.fs.collection('games', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      query = ref.where(type, '==', 'null');
      query = ref.where('active', '==', true);
      return query;
    });
  }

  searchGameX(uid: string) {
    return this.fs.collection('games', ref => {
      let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
      query = query.where('userX.uid', '==', uid);
      query = query.where('active', '==', true);
      return query;
    });
  }

  createGame(data: any) {
    return this.fs.collection('games').add({
      userX: data,
      userO: 'null',
      squares: Array(9).fill(null),
      xIsNext: true,
      winner: 'null',
      active: true,
      tie: false,
      game: 1
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
