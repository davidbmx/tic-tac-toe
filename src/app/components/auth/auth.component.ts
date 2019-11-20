import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  label: string;

  constructor(
    private authService: AuthService,
    private fire: FirestoreService,
    private router: Router
  ) { }

  ngOnInit() {
    // this.authService.logout();
  }

  signUp() {
    this.authService.signWithGmail().then(result => {
      if (!result.additionalUserInfo.isNewUser) {
        return this.router.navigateByUrl('/');
      }

      const dataUser = {
        uid: result.user.uid,
        displayName: result.user.displayName,
        photoUrl: result.user.photoURL
      };
      this.fire.createUser(dataUser).then(() => {
        this.router.navigateByUrl('/');
      })
      .catch(err => {
        console.log(err);
        this.label = 'Error login';
      });
    });
  }

}
