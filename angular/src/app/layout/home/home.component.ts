import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Apiservice } from "src/app/utils/api.service";
import * as Tesseract from "tesseract.js";
import { createWorker } from "tesseract.js";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  providers: [],
})
export class HomeComponent {
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private postLogin: Apiservice,
    private nav: Router,
    private route: Router
  ) { }
  showModal = true;
  updatepassword = 1
  displayError = false;
  msg = "";
  toggleIcon = true;
  visibility = true;
  validatorForEmailOrPhone = "";
  validationForPassword = "";
  VisibilityPassword = true;
  VisibilityConfirmPassword = true;
  src = "https://cdn.pixabay.com/photo/2017/08/06/21/01/louvre-2596278_960_720.jpg"
  data = {};
  handleModalClose() {
    this.showModal = false;
  }
  toggleVisibility() {
    console.log(this.visibility);
    this.visibility = !this.visibility;
  }
  togglePasswordVisibility() {
    this.VisibilityPassword = !this.VisibilityPassword;
  }
  toggleConfirmPasswordVisibility() {
    this.VisibilityConfirmPassword = !this.VisibilityConfirmPassword;
  }

  profileForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(/^(?:[_a-z0-9-]+)(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,6})$/)]],
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    fathersname: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    pincode: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
    city: ['', [Validators.required, Validators.required]],
    address: ['', [Validators.required]],
    age:['', [Validators.required, Validators.maxLength(2)]],
   adharnumber:['', [Validators.required, Validators.maxLength(12),Validators.minLength(12)]],
    dob: ['',[Validators.required]],
  });
  passwordForm=this.formBuilder.group({
    oldpassword: ['', [Validators.required, Validators.minLength(8)]],
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
  })

  

  loadFile(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file) {
      this.src = URL.createObjectURL(file);
    }

  }
  prevScreen() {

    this.updatepassword = this.updatepassword - 1
    console.log(this.updatepassword, "next")
  }
  nextScreen() {

    this.updatepassword = this.updatepassword + 1
    console.log(this.updatepassword, "next")
  }
  getInfo(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file) {
      Tesseract.recognize(file, "eng", { logger: console.log }).then(
        ({ data: { text } }) => {
          console.log(text, "text")
          this.getDateOfBirth(text);
        }
      );
    }
  }
  getAdhar(text: string) {
    const numberMatch = text.match(/\s\w{4}\s\w{4}\s\w{4}\s/g);
    const adharnumber = numberMatch?.[0]?.trim() ?? "Not found";
    console.log("Extracted number:", adharnumber);
    if (parseInt(adharnumber) && parseInt(adharnumber).toString.length == 12) {
      console.log("valid adhar number");
    } else {
      console.log("adhar is in valid");
    }
  }
  getDateOfBirth(text: string) {
    const dateMatch = text.match(/(?:\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      const extractedDate = dateMatch[0];
      const age = new Date(extractedDate);
      const today = new Date();
      const ageInYears = Math.floor(
        (today.getTime() - age.getTime()) / 31536e6
      );
      if (ageInYears < 18) {
        console.log("Younger than 18");
      } else {
        this.getAdhar(text);
      }
    } else {
      console.log("No date or number found in the string.");
    }
  }
  showdetails(val: number) {
    this.updatepassword = val;
  }
  onSubmit() { }
}
