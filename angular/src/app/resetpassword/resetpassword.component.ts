import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import endpoints from 'src/utils/apiEndPoints';
import { Apiservice } from '../utils/api.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css'],
  providers: [Apiservice],
})
export class ResetpasswordComponent {
  @ViewChild('myInput') myInput!: ElementRef;
  displayError: boolean = false;
  msg: string = "";
  constructor(private formBuilder: FormBuilder, private postRest: Apiservice, private nav: Router) { }
  id = ""
  token = ""
  sendcode = true
  otp: string = ""
  toggleform = true;
  toggleIcon = '✉️';
  userId = ''
  validatorForEmailOrPhone = '';
  otpForm = this.formBuilder.group({
    input1: ['', [Validators.required, Validators.maxLength(1)]],
    input2: ['', [Validators.required, Validators.maxLength(1)]],
    input3: ['', [Validators.required, Validators.maxLength(1)]],
    input4: ['', [Validators.required, Validators.maxLength(1)]],
  });
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
              this.sendcode = false
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
              this.sendcode = true
              return { control: true };
            } else {
              return null;
            }
          }
        },
      ]),
    ],
  });

  handleKeyUp(event: any) {
    if (event.key != 'Backspace') {
      if (event.target.value.length === 1) {
        const nextInput = event.target as HTMLInputElement;
        if (nextInput.nextElementSibling instanceof HTMLInputElement) {
          nextInput.nextElementSibling.focus();
        }
      }
    } else {
      const nextInput = event.target as HTMLInputElement;

      if (nextInput.previousElementSibling instanceof HTMLInputElement) {
        nextInput.previousElementSibling.focus();

      }
    }

  }

  onSubmit() {
    const { base_url, resetPassword } = endpoints;
    if (this.profileForm.value.email) {
      if (parseInt(this.profileForm.value.email)) {
        const { email } = this.profileForm.value;
        const resetData = {
          phone: email,
        };
        const result = this.postRest.makeRequest(
          `${base_url}${resetPassword}`, 'POST',
          resetData
        );
        result.subscribe({
          next: (value: unknown) => {
            const data = value as { [key: string]: string };
            this.toggleform = false;
            this.userId = data['id']
            console.log(data);
          },
          error: (error: Error | HttpErrorResponse) => {
            this.displayError = true
            setTimeout(() => {
              this.displayError = false
            }, 5000)
            console.log(error)
            if (error instanceof HttpErrorResponse) {
              this.msg = error.error.msg
              console.log(error.error.msg)
            } else {
              this.msg = error.message
            }




          }
        });
      } else {
        const { base_url, resetPassword } = endpoints;
        const resetData = this.profileForm.value;
        const result = this.postRest.makeRequest(
          `${base_url}${resetPassword}`, 'POST',
          resetData
        );
        result.subscribe({
          next: (value: unknown) => {
            const data = value as { [key: string]: string };
            this.userId = data['id']
            console.log(data)
          },
          error: (error: Error | HttpErrorResponse) => {
            this.displayError = true
            setTimeout(() => {
              this.displayError = false
            }, 5000)
            console.log(error)
            if (error instanceof HttpErrorResponse) {
              this.msg = error.error.msg
              console.log(error.error.msg)
            } else {
              this.msg = error.message
            }

          }

        })
      }
    }
  }


  submitOtp() {
    const { base_url, otpVerify } = endpoints;
    const otpObject = <{ [val: string]: string }>this.otpForm.value

    for (let val in otpObject) {
      this.otp = this.otp + otpObject[val]
    }
    if (this.otp.length > 4) {

      this.otp = this.otp.slice(4)

    }
    const otpData = {
      id: '657284761767d0b33c94135e',
      otp: this.otp
    }



    const result = this.postRest.makeRequest(
      `${base_url}${otpVerify}`, 'POST',
      otpData
    );
    result.subscribe({
      next: (value: unknown) => {
        const data = value as { [key: string]: string };

        console.log(data)
        const regexToken = /http:\/\/localhost:4200\/(.+?)\/userId/;
        const tokenMatch = data['msg']['match'](regexToken);

        const regexId = /\/userId\/(.+?)$/;
        const idMatch = data['msg']['match'](regexId);


        if (tokenMatch && idMatch) {
          this.token = tokenMatch[1];
          this.id = idMatch[1];
          console.log(`/${this.token}/userId/${this.id}`)


          this.nav.navigateByUrl(`/${this.token}/userId/${this.id}`)

        } else {
          console.error("Unable to extract token or ID");
        }

      },error:error=> {console.error(error)}}



    )
  }
}
// this.nav.navigateByUrl(`/${this.token}/userId/${this.id}`)