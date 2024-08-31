import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,  // Mark this component as standalone
  imports: [CommonModule],  // Import CommonModule to use Angular directives like *ngIf
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  @Input() type: string = 'system'; // Default type set to 'system'
  @Input() content: string = '';    // Content input to receive message text
}
