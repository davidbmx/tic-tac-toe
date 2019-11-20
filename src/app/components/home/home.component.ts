import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = 'tic-tac-toe';
  squares: Array<string>;
  xIsNext: boolean;
  label: string;
  user: any;

  constructor(
    private authService: AuthService,
    private fs: FirestoreService,
    private router: Router
  ) {
    this.squares = Array(9).fill(null);
    this.xIsNext = true;
    this.label = 'Next player X';
  }

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  selectSquare(value: number) {
    if (this.calculateWinner(this.squares) || this.squares[value]) {
      return;
    }
    const next = !this.xIsNext ? 'X' : 'O';
    this.squares[value] = this.xIsNext ? 'X' : 'O';
    this.xIsNext = !this.xIsNext;
    const winner = this.calculateWinner(this.squares);
    if (winner) {
      this.label = `El ganador es ${winner}`;
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
    const dataUser = {
      uid: this.user.uid,
      displayName: this.user.displayName,
      photoUrl: this.user.photoURL
    };
    this.fs.searchGame().get().subscribe(data => {
      console.log(data.size);
      if (data.size > 0) {
        data.docs[0].ref.update({userO: dataUser}).then();
        return;
      }

      this.fs.createGame(dataUser).then();
    });
  }

}
