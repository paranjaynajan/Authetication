import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Apiservice } from '../utils/api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private nav:Router,private http:Apiservice){}
  dropdownMenu=false
   @HostListener('window:resize', [])
  onResize() {
    if (window.innerWidth < 772 ) {
    } else {
      this.dropdownMenu=false
      console.log('Desktop/tablet device detected');
    }
  }
 

 toggle(){
   console.log(this.dropdownMenu)
   this.dropdownMenu=!this.dropdownMenu
 }  

 userLogout(){
  const token = this.http.makeRequest(
    'http://localhost:5000/api/user/signout',
    'GET'
  );
  token.subscribe({
    next: (token) => {
      localStorage.clear();
      this.nav.navigateByUrl('/login');
    },
    error: (error) => {
      console.log(error, 'error');
    },
  });

 }
}
