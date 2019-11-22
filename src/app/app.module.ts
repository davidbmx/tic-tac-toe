import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { SquareComponent } from './components/square/square.component';
import { environment } from '../environments/environment';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';
import { AuthService } from './services/auth.service';
import { FirestoreService } from './services/firestore.service';
import { ScoresComponent } from './components/scores/scores.component';
import { LoaderComponent } from './components/loader/loader.component';
import { UserInfoComponent } from './components/user-info/user-info.component';

@NgModule({
  declarations: [
    AppComponent,
    SquareComponent,
    AuthComponent,
    HomeComponent,
    ScoresComponent,
    LoaderComponent,
    UserInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFirestoreModule
  ],
  providers: [ AuthService, FirestoreService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
