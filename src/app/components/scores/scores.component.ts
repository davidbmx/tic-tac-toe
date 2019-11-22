import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { UserScore } from '../../interfaces/index';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css']
})
export class ScoresComponent implements OnInit {

  usersScore: Array<UserScore>;
  loading: boolean;

  constructor(
    private fs: FirestoreService
  ) {
    this.loading = true;
  }

  ngOnInit() {
    this.fs.getUsersScore()
    .valueChanges()
    .subscribe((data: Array<UserScore>) => {
      this.usersScore = data;
      this.loading = false;
    });
  }

}
