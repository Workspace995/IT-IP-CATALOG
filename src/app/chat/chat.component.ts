import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { MessageComponent } from '../message/message.component';  // Correct import for standalone component
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MessageComponent],  // Import MessageComponent directly
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(100%)' }),
        animate('200ms ease-in')
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0, transform: 'translateY(100%)' }))
      ])
    ])
  ]
})
export class ChatComponent implements OnInit {
  @ViewChild('chatBody') private chatBody!: ElementRef;

  displayChatWindow = false;
  currentUser: any = null;
  isSearching = false;

  messages: { type: string; text: string }[] = [];
  chatForm = new FormGroup({
    message: new FormControl('')
  });

  constructor(private http: HttpClient, private chatService: ChatService) {}

  ngOnInit() {
    let user = localStorage.getItem("user");
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }

  scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight + 200;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  send() {
    const message = this.chatForm.value.message?.trim();
    console.log('Sending message:', message);

    if (message) {
      this.messages.push({
        type: 'user',
        text: message
      });
      console.log('Messages after sending:', this.messages);
      this.chatForm.patchValue({ message: '' });
      this.isSearching = true;
      this.scrollToBottom();

      this.chatService.callChatApi({ query: message, userid: this.currentUser?.userid || 10, source: 's3' }).subscribe(
        (response: any) => {
          console.log('Received response from chatbot:', response);
          this.messages.push({
            type: 'system',
            text: response.answer
          });
          console.log('Messages after receiving response:', this.messages);
          this.isSearching = false;
          this.scrollToBottom();
        },
        (error) => {
          console.error('Error fetching chatbot response:', error);
          alert("Something went wrong!");
          this.isSearching = false;
        }
      );
    }
  }
}
