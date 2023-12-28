import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import endpoints from 'src/utils/apiEndPoints';
import { Apiservice } from '../utils/api.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers:[Apiservice]
})
export class SignupComponent {
constructor(
  private formBuilder: FormBuilder,
  private signUpuser:Apiservice,
  private nav:Router
  ){}
  displayError =false
  msg = ""
validationForPassword=""
VisibilityPassword=true
VisibilityConfirmPassword=true
profileForm = this.formBuilder.group({
  email: ['', [Validators.required,Validators.pattern(/^(?:[_a-z0-9-]+)(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,6})$/)]],
  name:['' ,[Validators.required]],
  password: ['', Validators.compose([Validators.required,(password) => {
    if (!password.value) {
      return null;
    }
    if (password.value.length < 8) {
      this.validationForPassword='Password must be at least 8 characters long';
      return { password: true };
    }

   
    if (!/[A-Z]/.test(password.value)) {
      this.validationForPassword='Password must contain at least one uppercase letter';
      return { password: true };
    }


    if (!/[a-z]/.test(password.value)) {
      this.validationForPassword= 'Password must contain at least one lowercase letter';
      return { password: true };
    }


    if (!/\d/.test(password.value)) {
      this.validationForPassword='Password must contain at least one number';
      return { password: true };
    }

  
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password.value)) {
      this.validationForPassword='Password must contain at least one special character';
      return { password: true };
    }


    return null;
}])],
  confirmPassword: ['', Validators.compose([Validators.required, Validators.minLength(8), (control) => {
    const password = control.root.get('password');
    if (!password) {
      return null;
    }
    if (password.value !== control.value) {
      return { passwordMismatch: true };
    }
    return null;
  }])],

  phone: ['', [Validators.required, Validators.minLength(10),Validators.maxLength(10)]] 
});

togglePasswordVisibility() {
  this.VisibilityPassword = !this.VisibilityPassword;
}
toggleConfirmPasswordVisibility() {
  this.VisibilityConfirmPassword= !this.VisibilityConfirmPassword;
}
onSubmit() {

  const {confirmPassword,...signUpdata}=this.profileForm.value
  const {base_url,userSignup}=endpoints 
  console.warn(signUpdata);
  const result= this.signUpuser.makeRequest(`${base_url}${userSignup}`,'POST',signUpdata)
  result.subscribe({
    next:(data)=>{
    this.nav.navigateByUrl("/login")
    console.log(data)},
    
    error: (error: Error | HttpErrorResponse) => {
      this.displayError = true
      setTimeout(() => {
        this.displayError = false
      }, 5000)
      console.log(error)
      if (error instanceof HttpErrorResponse) {
        this.msg = error.error.msg
        console.log(error.error.msg)
      }else{
        this.msg=error.message
      }
  
    }})
    
}

}


