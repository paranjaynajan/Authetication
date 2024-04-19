import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Apiservice } from '../utils/api.service';
import endpoints from 'src/utils/apiEndPoints';

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
   
   this.dropdownMenu=!this.dropdownMenu
   console.log(this.dropdownMenu,"toggle menu")
 }  

 userLogout(){
  const { base_url_auth, userLogout } = endpoints;
  const result = this.http.makeRequest(
    `${base_url_auth}${userLogout}`,
    'GET',
  );
 ;
  result.subscribe({
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
