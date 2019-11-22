import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { Game, UserScore } from '../../interfaces/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = 'tic-tac-toe';
  label: string;
  user: any;
  usersActive: any;
  usersScore: Array<UserScore>;
  isGameActive: boolean;
  loading: boolean;
  game: Game;
  icon: string;

  constructor(
    private authService: AuthService,
    private fs: FirestoreService,
    private router: Router
  ) {
    this.label = 'Next player X';
    this.isGameActive = false;
    this.loading = true;
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    const idGameActive = this.getStorage('game');
    if (idGameActive) {
      this.watchGame(idGameActive);
      return;
    }
    this.loading = false;
  }

  selectSquare(value: number) {
    const actual = this.game.xIsNext ? 'X' : 'O';
    const next = !this.game.xIsNext ? 'X' : 'O';
    if (this.icon !== actual) {
      return;
    }

    if (this.calculateWinner(this.game.squares) || this.game.squares[value]) {
      return;
    }
    this.game.squares[value] = actual;
    this.game.xIsNext = !this.game.xIsNext;
    this.label = `Next player ${next}`;
    const winner = this.calculateWinner(this.game.squares);
    const finishTie = this.game.squares.filter(square => square == null);
    if (finishTie.length === 0 && !winner) {
      this.game.active = false;
      this.game.tie = true;
      this.updateGame().then();
      return;
    }
    if (winner) {
      this.game.winner = (winner === 'X') ? this.game.userX : this.game.userO;
      this.game.active = false;
      this.updateGame().then();
      return;
    }
    this.updateGame().then();
  }

  calculateWinner(squares: Array<string>) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  newGame() {
    this.loading = true;
    const dataUser = {
      uid: this.user.uid,
      displayName: this.user.displayName,
      photoUrl: this.user.photoURL
    };
    this.fs.searchGame('userO').get().subscribe(data => {
      if (data.size > 0) {
        const index = Math.floor(Math.random() * data.size);
        data.docs[index]
          .ref.update({userO: dataUser}).then((game) => {
            this.watchGame(data.docs[index].id);
            return;
          });
      } else {
        this.fs.createGame(dataUser).then((save) => {
          this.watchGame(save.id);
        });
      }
    });
  }

  watchGame(id: string) {
    this.fs.watchGame(id).valueChanges().subscribe((snap: Game) => {
      if (!snap) {
        this.delStorage();
      }
      this.game = snap;
      this.game.id = id;
      this.isGameActive = snap.active;
      if (snap.userX && snap.userX.uid === this.user.uid) {
        this.icon = 'X';
      } else if (snap.userO && snap.userO.uid === this.user.uid) {
        this.icon = 'O';
      }
      this.loading = false;
      this.setStorage('game', id);
    });
  }

  async updateGame() {
    await this.fs.updateGame(this.game);
  }

  setStorage(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }

  getStorage(key: string) {
    return sessionStorage.getItem(key);
  }

  delStorage() {
    sessionStorage.clear();
  }

}
