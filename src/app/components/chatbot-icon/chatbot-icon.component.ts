import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'chatbot-icon',
  imports: [],
  templateUrl: './chatbot-icon.component.html',
  styleUrl: './chatbot-icon.component.scss',
})
export class ChatbotIcon {
  @Input() iconChatbot!: string;
  @Output() chatbotClicked = new EventEmitter<void>();

  onClickedChatbotIcon(): void {
    this.chatbotClicked.emit();
  }
}
