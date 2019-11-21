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
    this.loading = false;
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.fs.getUsersScore()
    .valueChanges()
    .subscribe((data: Array<UserScore>) => {
      this.usersScore = data;
    });
    this.fs.searchGameX(this.user.uid).get().subscribe(snap => {
      if (snap.size === 1) {
        const data = snap.docs[0].data();
        if (data.active) {
          this.watchGame(snap.docs[0].id);
          this.isGameActive = true;
          this.loading = false;
          this.icon = 'X';
        }
      }
    });
  }

  async selectSquare(value: number) {
    if (!(this.game.xIsNext && this.icon === 'X')) {
      return;
    }

    if (this.calculateWinner(this.game.squares) || this.game.squares[value]) {
      return;
    }
    const next = !this.game.xIsNext ? 'X' : 'O';
    this.game.squares[value] = this.game.xIsNext ? 'X' : 'O';
    this.game.xIsNext = !this.game.xIsNext;
    await this.updateGame();
    const winner = this.calculateWinner(this.game.squares);
    if (winner) {
      this.label = `The Winner is ${winner}`;
      this.game.winner = (winner === 'X') ? this.game.userX : this.game.userO;
      this.game.active = false;
      this.updateGame();
      return;
    }
    this.label = `Next player ${next}`;
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
            this.isGameActive = true;
            this.loading = false;
            this.icon = 'O';
            this.watchGame(data.docs[index].id);
            return;
          });
      } else {
        this.fs.createGame(dataUser).then((save) => {
          this.loading = false;
          this.isGameActive = true;
          this.icon = 'X';
          this.watchGame(save.id);
        });
      }
    });
  }

  watchGame(id: string) {
    this.fs.watchGame(id).valueChanges().subscribe((snap: Game) => {
      this.game = snap;
      this.game.id = id;
    });
  }

  async updateGame() {
    await this.fs.updateGame(this.game);
  }

}
