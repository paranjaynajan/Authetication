import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
  constructor(private http: Apiservice, private route: Router) {}
  showModal=true 
  
 handleModalClose(){
  this.showModal=false
 }


  getInfo(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file) {
      Tesseract.recognize(file, "eng", { logger: console.log })
          .then(({ data: { text } }) => {
            this.getDateOfBirth(text)
          });
    }
  }
  getAdhar(text: string){
    const numberMatch = text.match(/\s\w{4}\s\w{4}\s\w{4}\s/g);
    const adharnumber =numberMatch?.[0]?.trim()  ?? "Not found"
    console.log("Extracted number:",adharnumber);
    if(parseInt(adharnumber) && parseInt(adharnumber).toString.length==12){
      console.log("valid adhar number")
    }else{
      console.log("adhar is in valid")
    }
  }
  getDateOfBirth(text:string){
    const dateMatch = text.match(/(?:\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})/);
    if (dateMatch) {
      const extractedDate = dateMatch[0];
      const age = new Date(extractedDate);
      const today = new Date();
      const ageInYears = Math.floor((today.getTime() - age.getTime()) / 31536e6);              
      if (ageInYears < 18) {
        console.log("Younger than 18");
      }else{
        this.getAdhar(text)
      }
    } else {
      console.log("No date or number found in the string.");
    }
  }
}
