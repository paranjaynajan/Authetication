import { HTTP_INTERCEPTORS,  HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LayoutComponent } from './layout/layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SubmenuComponent } from './submenu/submenu.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { PollComponent } from './layout/poll/poll.component';
import { HomeComponent } from './layout/home/home.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { CarosuleComponent } from './components/carosule/carosule.component';
import { Apiservice } from './utils/api.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
   LayoutComponent,
    NavbarComponent,
    SubmenuComponent,
    ResetpasswordComponent,
    ChangepasswordComponent,
    HomeComponent,
    PagenotfoundComponent,
    CarosuleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    PollComponent,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Apiservice, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
