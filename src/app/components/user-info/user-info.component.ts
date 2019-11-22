import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  user: any;
  display: boolean;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.display = false;
  }

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  dropDownMenu() {
    this.display = !this.display;
  }

  logout() {
    this.authService.logout();
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }

}
