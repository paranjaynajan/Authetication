import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title:{title:"",id:""}[] = [];
 
  constructor(
    private http: HttpClient
   ) { }

  ngOnInit(): void {
  //  const data= this.http.get<{title:"",id:""}[]>('https://jsonplaceholder.typicode.com/todos')
  //  .subscribe((data:{title:"",id:""}[])=>{
  //   this.title=data.slice(1,13)
  // console.log(this.title[0].id)
  //   })
    
    ;}
}
