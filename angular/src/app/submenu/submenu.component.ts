import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.css']
})
export class SubmenuComponent {
@Input('height') subMenuHeight:string='300px'
@Input('width') subMenuWidth:string='500px'


}
