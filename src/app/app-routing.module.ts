import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';

const redirectUnauthorized = () => redirectUnauthorizedTo(['login']);
const redirectAuthrized = () => redirectLoggedInTo(['']);

const routes: Routes = [
  { path: 'login', component: AuthComponent, data: { authGuardPipe: redirectAuthrized } },
  {path: '', component: HomeComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorized} },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
