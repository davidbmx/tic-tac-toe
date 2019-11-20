import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tic-tac-toe';
  squares: Array<number>;

  constructor() {
    this.squares = Array(9).fill(1);
    console.log(this.squares);
  }
}
