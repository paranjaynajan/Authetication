import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>();

  handleClose() {
    this.isOpen = false;
    this.onClose.emit();
  }
}
