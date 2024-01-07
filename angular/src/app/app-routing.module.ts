import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { HomeComponent } from './layout/home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { PollComponent } from './layout/poll/poll.component';
import { LoginComponent } from './login/login.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { SignupComponent } from './signup/signup.component';
import {  TokenGuard } from './utils/Routeguard';

// const routes: Routes = [{
//   path:'',
//   component:LoginComponent
// },{
//   path:"signup",
//   component: SignupComponent
// },
// {
//   path:"home",
//   component: HomepageComponent
// },
// {
//   path:"resetpassword",
//   component:ResetpasswordComponent
// },
// {
//   path:":token/userId/:id",
//   component:ChangepasswordComponent
// }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }



const routes: Routes = [

  {
    path: '',
    component:  LayoutComponent,
     canActivate:[TokenGuard],
    children: [
      {
        path:"",
        component:HomeComponent
      },
  {
    path:"poll",
    component:PollComponent
  }
    ],
  },
  {
      path:'login',
      component:LoginComponent
    },{
      path:"signup",
      component: SignupComponent
    },

    {
      path:"resetpassword",
      component:ResetpasswordComponent
    },
    {
      path:":token/userId/:id",
      component:ChangepasswordComponent
    },
    { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}