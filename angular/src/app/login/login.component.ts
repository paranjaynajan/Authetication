import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import endpoints from 'src/utils/apiEndPoints';
import { Apiservice } from '../utils/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [Apiservice],
})
export class LoginComponent {
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private postLogin: Apiservice,
    private nav: Router
  ) {}
  displayError = false;
  msg = '';
  toggleIcon = '✉️';
  visibility = true;
  validatorForEmailOrPhone = '';
  data = {};
  profileForm = this.formBuilder.group({
    email: [
      '',
      Validators.compose([
        Validators.required,
        (control) => {
          if (!control.value) {
            return null;
          }
          if (parseInt(control.value)) {
            if (!/^\d{10}$/.test(control.value)) {
              this.validatorForEmailOrPhone = 'Phone must be 10 digit number';
              this.toggleIcon = '📞';
              return { control: true };
            } else {
              return null;
            }
          } else {
            if (
              !/^(?:[_a-z0-9-]+)(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,6})$/.test(
                control.value
              )
            ) {
              this.validatorForEmailOrPhone = 'Enter a valid email';
              this.toggleIcon = '✉️';
              return { control: true };
            } else {
              return null;
            }
          }
        },
      ]),
    ],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  toggleVisibility() {
    console.log(this.visibility);
    this.visibility = !this.visibility;
  }

  onSubmit() {
    const { base_url, userLogin } = endpoints;
   
    if (this.profileForm.value.email) {
      
      if (parseInt(this.profileForm.value.email)) {
        console.log(parseInt(this.profileForm.value.email),"asdsadasdsd");
        const { password, email } = this.profileForm.value;
        const userLoginData = {
          password,
          phone: email,
        };
    
        const result = this.postLogin.makeRequest(
          `${base_url}${userLogin}`,
          'POST',
          userLoginData
        );
        result.subscribe({
          next: (value) => {
            const data = value as { [key: string]: string };
            localStorage.setItem('token', data['token']);
            this.nav.navigateByUrl('/home');
          },
          error: (error: Error | HttpErrorResponse) => {
            this.displayError = true;
            setTimeout(() => {
              this.displayError = false;
            }, 5000);
            if ((error instanceof HttpErrorResponse)) {
              this.msg = error.error.msg;
              console.log(error.error.msg);
            } else {
              this.msg = error.message;
              console.log(error);
            }
          },
        });
      }else {
        console.log(this.profileForm.value);
        const result = this.postLogin.makeRequest(
          `${base_url}${userLogin}`,
          'POST',
          this.profileForm.value
        );
        result.subscribe({
          next: (value) => {
            const data = value as { [key: string]: string };
            localStorage.setItem('token', data['token']);
            this.nav.navigateByUrl('/home');
          },
          error: (error: Error | HttpErrorResponse) => {
            this.displayError = true;
            setTimeout(() => {
              this.displayError = false;
            }, 5000);
            if ((error instanceof HttpErrorResponse)) {
              this.msg = error.error.msg;
              console.log(error.error.msg);
            } else {
              this.msg = error.message;
              console.log(error);
            }
          },
        });
      }
    } 
  }
}

// const handleChangeForEmail_Phone = (val: string) => {
//   if (parseInt(val)) {
//     setLoginForm(form => ({ ...form, mobileNumber: val }))
//     setToggleValidation(true);

//   } else {
//     setLoginForm(form => ({ ...form, email: val }))
//     setToggleValidation(false);

//   }

// }
// [Validators.required, Validators.pattern(/^(?:[_a-z0-9-]+)(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,6})$/)]
