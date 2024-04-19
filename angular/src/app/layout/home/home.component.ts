import { HttpClient } from "@angular/common/http";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Apiservice } from "src/app/utils/api.service";
import endpoints from "src/utils/apiEndPoints";
import * as Tesseract from "tesseract.js";
import { createWorker } from "tesseract.js";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  providers: [],
})


export class HomeComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private req: Apiservice,
    private nav: Router,
    private route: Router
  ) {
    const { base_url_auth, user,update,changepassword } = endpoints;
    this.base_url_auth = base_url_auth;
    this.user = user
    this.update=update
    this.changepassword=changepassword
  }

  ngOnInit(): void {
    this.adhaarForm.get("dob")?.valueChanges.subscribe((dob) => {
      if (dob) {
        const age = this.calculateAge(dob);
        this.adhaarForm.get("age")?.setValue(age.toString());
      }
    });

    const res = this.req.makeRequest(`${this.base_url_auth}${this.user}`, "GET");
    res.subscribe({
      next: (value) => {
        const data = value as { [key: string]: {} };
        const user: any = data["user"];
        console.log(data, "data");
        this.profileForm.patchValue({
          name: user.name,
          lastname: user.lastname,
          fathersname: user.fathersname,
          phone: user.phone,
          pincode: user.address.pincode,
          city: user.address.city,
          address: user.address.address,
        });
        this.src = user.image;
        this.adhaarForm.patchValue({
          adharnumber: user.adharnumber,
          age: user.age,
          dob: user.dob,
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  base_url_auth: string="";
  user: string="";
  update:string="";
  changepassword:string="";
  buttonText: string = "";
  adharupdate: boolean = false;
  showModal: boolean = true;
  updatedetals: number = 1;
  displayError: boolean = false;
  msg: string = "";
  toggleIcon: boolean = true;
  visibility: boolean = true;
  validatorForEmailOrPhone: string = "";
  validationForPassword: string = "";
  VisibilityPassword: boolean = true;
  VisibilityConfirmPassword: boolean = true;
  src: string =
    "https://cdn.pixabay.com/photo/2017/08/06/21/01/louvre-2596278_960_720.jpg";

  closeModal() {
    this.showModal = false;
  }
  toggleVisibility(): void {
    console.log(this.visibility);
    this.visibility = !this.visibility;
  }
  togglePasswordVisibility(): void {
    this.VisibilityPassword = !this.VisibilityPassword;
  }
  toggleConfirmPasswordVisibility(): void {
    this.VisibilityConfirmPassword = !this.VisibilityConfirmPassword;
  }

  profileForm = this.formBuilder.group({
    name: ["", [Validators.required]],
    lastname: ["", ],
    fathersname: ["", ],
    phone: [
      "",
      [Validators.required, Validators.minLength(10), Validators.maxLength(10)],
    ],
    pincode: [
      "",
      [, Validators.min(1000000), Validators.max(9999999)],
    ],
    city: ["", ],
    address: ["", ],
  });

  adhaarForm = this.formBuilder.group({
    age: ["", [Validators.required, Validators.maxLength(2)]],
    adharnumber: [
      "",
      [
        Validators.required,
        Validators.min(100000000000),
        Validators.max(999999999999),
      ],
    ],
    dob: ["", [Validators.required]],
  });

  passwordForm = this.formBuilder.group({
    oldpassword: ["", [Validators.required, Validators.minLength(8)]],
    password: [
      "",
      Validators.compose([
        Validators.required,
        (password) => {
          if (!password.value) {
            return null;
          }
          if (password.value.length < 8) {
            this.validationForPassword =
              "Password must be at least 8 characters long";
            return { password: true };
          }

          if (!/[A-Z]/.test(password.value)) {
            this.validationForPassword =
              "Password must contain at least one uppercase letter";
            return { password: true };
          }

          if (!/[a-z]/.test(password.value)) {
            this.validationForPassword =
              "Password must contain at least one lowercase letter";
            return { password: true };
          }

          if (!/\d/.test(password.value)) {
            this.validationForPassword =
              "Password must contain at least one number";
            return { password: true };
          }

          if (!/[!@#$%^&*(),.?":{}|<>]/.test(password.value)) {
            this.validationForPassword =
              "Password must contain at least one special character";
            return { password: true };
          }

          return null;
        },
      ]),
    ],
    confirmPassword: [
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        (control) => {
          const password = control.root.get("password");
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

  calculateMaxDate(): string {
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    const validDate = minDate.toISOString().split("T")[0];
    return validDate;
  }

  calculateAge(dob: string): number {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }

  loadFile(event: Event): void {
    const { base_url_auth, imageUpload } = endpoints;
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file) {
      this.src = URL.createObjectURL(file);
      const formData = new FormData();
      formData.append("profile_image", file);
      const res = this.req.makeRequest(
        `${base_url_auth}${imageUpload}`,
        "POST",
        formData,
        true
      );
      res.subscribe({
        next: (value) => {
          const data = value as { [key: string]: {} };
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  showdetails(val: number) {
    this.updatedetals = val;
  }

  onSubmitAdhar() {
    console.log(this.adhaarForm,"adhar");
    const res = this.req.makeRequest(`${this.base_url_auth}${this.update}`, "PUT",this.adhaarForm.value);
  }

  onSubmitPass() {
    console.log(this.passwordForm,"Pass");
    const res = this.req.makeRequest(`${this.base_url_auth}${this.changepassword}`, "PUT",this.passwordForm.value);
  }
  onSubmitUser() {
    console.log(this.profileForm.value,"User");
    const res = this.req.makeRequest(`${this.base_url_auth}${this.update}`, "PUT",this.profileForm.value);
  }
}
