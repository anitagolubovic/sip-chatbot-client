import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, SendMessageData } from '../app/models/chatbot';
import { Maybe } from './models/types';
import { isDefined } from './types.helper';

const MESSAGE_BUFFER_SIZE = 4;

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private socket!: Socket;

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private isTypingSubject = new BehaviorSubject<boolean>(false);
  public isTyping$ = this.isTypingSubject.asObservable();

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket(): void {
    this.socket = io('http://localhost:3000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 2,
    });

    this.socket.on('connected', (data) => {
      console.log('Connected to server:', data);
    });

    this.socket.on('receiveMessage', (data: any) => {
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([
        ...currentMessages,
        {
          role: data.role || 'assistant',
          content: data.content || data.answer,
        },
      ]);
    });

    this.socket.on('botTyping', (data: any) => {
      this.isTypingSubject.next(data.status);
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });
  }

  sendQuery(question: string, category: Maybe<string> = null): void {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([
      ...currentMessages,
      {
        role: 'user',
        content: question,
      },
    ]);
    const data: SendMessageData = { question, conversationHistory: [] };

    if (isDefined(category)) {
      const conversationHistory = this.messagesSubject.value.slice(-MESSAGE_BUFFER_SIZE);
      data.conversationHistory = conversationHistory;
      data.category = category;
    }

    this.socket.emit('sendMessage', data);
  }
}
