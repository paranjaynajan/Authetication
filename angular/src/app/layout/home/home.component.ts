import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apiservice } from 'src/app/utils/api.service';
// import { Apiservicehttp } from 'src/app/utils/Apiservice';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [],
})
export class HomeComponent {
  constructor(private http: Apiservice, private route: Router) {}


}
