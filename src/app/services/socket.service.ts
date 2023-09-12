import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {
    this.connect();
  }

  // Connect to the server
  connect() {
    this.socket.connect();
  }

  // Disconnect from the server
  disconnect() {
    this.socket.disconnect();
  }

  // Send a chat message to the server
  sendMessage(message: string) {
    this.socket.emit('chat message', message);
  }

  // Listen for chat messages
  receiveMessage(): Observable<string> {
    return this.socket.fromEvent<string>('chat message');
  }
}
