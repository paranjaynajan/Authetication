import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import endpoints from 'src/utils/apiEndPoints';
import { Apiservice } from '../utils/api.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css'],
  providers: [Apiservice],
})
export class ChangepasswordComponent implements OnInit {
  displayError: boolean = false;
  msg: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private nav: Router,
    private changePassword: Apiservice
  ) {}
  userId: string = '';
  userToken: string = '';
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const { token, id } = params;
      this.userId = id;
      this.userToken = token;
    });
  }
  validationForPassword = '';
  VisibilityPassword = true;
  VisibilityConfirmPassword = true;
  profileForm = this.formBuilder.group({
    password: [
      '',
      Validators.compose([
        Validators.required,
        (password) => {
          if (!password.value) {
            return null;
          }
          if (password.value.length < 8) {
            this.validationForPassword =
              'Password must be at least 8 characters long';
            return { password: true };
          }
          if (!/[A-Z]/.test(password.value)) {
            this.validationForPassword =
              'Password must contain at least one uppercase letter';
            return { password: true };
          }

          if (!/[a-z]/.test(password.value)) {
            this.validationForPassword =
              'Password must contain at least one lowercase letter';
            return { password: true };
          }

          if (!/\d/.test(password.value)) {
            this.validationForPassword =
              'Password must contain at least one number';
            return { password: true };
          }

          if (!/[!@#$%^&*(),.?":{}|<>]/.test(password.value)) {
            this.validationForPassword =
              'Password must contain at least one special character';
            return { password: true };
          }

          return null;
        },
      ]),
    ],
    confirmPassword: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        (control) => {
          const password = control.root.get('password');
          if (!password) {
            return null;
          }
          if (password.value !== control.value) {
            return { passwordMismatch: true };
          }
          return null;
        },
      ]),
    ],
  });

  togglePasswordVisibility() {
    this.VisibilityPassword = !this.VisibilityPassword;
  }
  toggleConfirmPasswordVisibility() {
    this.VisibilityConfirmPassword = !this.VisibilityConfirmPassword;
  }
  onSubmit() {
    const { base_url, newpassword } = endpoints;
    let userChangPassword = {
      password: this.profileForm.value.password,
      id: this.userId,
      token: this.userToken,
    };
    console.log(userChangPassword, 'token', this.userToken);
    const result = this.changePassword.makeRequest(
      `${base_url}${newpassword}`,
      'POST',
      userChangPassword
    );
    result.subscribe({
      next: (value:unknown) => {
        const data = value as { [key: string]: string };
        if (data['user'].length) {
          this.nav.navigateByUrl('/home');
        }
      },
      error: (error: Error | HttpErrorResponse) => {
        this.displayError = true;
        setTimeout(() => {
          this.displayError = false;
        }, 5000);
        console.log(error);
        if (error instanceof HttpErrorResponse) {
          this.msg = error.error.msg;
          console.log(error.error.msg);
        } else {
          this.msg = error.message;
        }
      },
    });
  }
}
