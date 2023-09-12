import { Component, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  message: string = '';
  messages: string[] = [];
  emoji = '';
  showEmojiPicker: boolean = false;

  constructor(
    private socketService: SocketService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // Connect to the server
    this.socketService.connect();

    // Listen for incoming messages
    this.socketService.receiveMessage().subscribe((message: string) => {
      this.messages.push(message);
    });
  }

  ngOnDestroy(): void {
    // Disconnect from the server when the component is destroyed
    this.socketService.disconnect();
  }

  sendMessage() {
    if (this.message) {
      // Send the message to the server
      this.socketService.sendMessage(this.message);
      this.message = '';
    }
  }

  getCurrentTime(): string {
    const now = new Date();
    const formattedTime = this.datePipe.transform(now, 'hh:mm a');
    return formattedTime || '';
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    this.message += event.emoji.native;
  }
}
