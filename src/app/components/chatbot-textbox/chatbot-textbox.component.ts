import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { ChatbotIcons, ChatMessage } from '../../models/chatbot';
import { Maybe } from '../../models/types';
import { ChatbotService } from '../../chatbot.service';

@Component({
  selector: 'chatbot-textbox',
  imports: [CommonModule, FormsModule, MatChipsModule],
  templateUrl: './chatbot-textbox.component.html',
  styleUrl: './chatbot-textbox.component.scss',
})
export class ChatbotTextbox {
  @Input() icons!: ChatbotIcons;
  @Output() closeChatbot = new EventEmitter<void>();

  chatbotService = inject(ChatbotService);
  inputText = signal('');
  selectedCategory = signal<Maybe<string>>(null);
  showCategories = signal(true);
  messages$ = this.chatbotService.messages$;
  isTyping$ = this.chatbotService.isTyping$;

  categories = [
    { label: 'Nastava na Osnovnim akademskim studijama', icon: './assets/bookmark.svg' },
    { label: 'Kalendar aktivnosti', icon: './assets/bookmark.svg' },
    { label: 'Polaganje ispita', icon: './assets/bookmark.svg' },
    {
      label: 'Upis nove školske godina na Osnovnim akademskim studijama',
      icon: './assets/bookmark.svg',
    },
    { label: 'Master akademske studije', icon: './assets/bookmark.svg' },
    { label: 'Doktorske akademske studije', icon: './assets/bookmark.svg' },
    { label: 'Obrasci i liste izbornih predmeta', icon: './assets/bookmark.svg' },
    { label: 'Literatura', icon: './assets/bookmark.svg' },
    { label: 'Rezultati ispita', icon: './assets/bookmark.svg' },
    { label: 'Stipendije, konkursi i razmene studenata', icon: './assets/bookmark.svg' },
  ];

  getIcon(message: ChatMessage): string {
    return message.role === 'assistant' ? this.icons.agent : this.icons.user;
  }

  isAssistantMessage(message: ChatMessage): boolean {
    return message.role === 'assistant';
  }

  onCloseChatbot(): void {
    this.closeChatbot.emit();
  }

  toggleCategories(): void {
    this.showCategories.set(!this.showCategories());
  }

  onCategorySelected(category: string): void {
    const previousCategory = this.selectedCategory();

    if (previousCategory === category) {
      this.selectedCategory.set(null);
    } else {
      this.selectedCategory.set(category);
      this.chatbotService.sendQuery(category, category);
    }
  }

  clearSelectedCategory(event?: Event): void {
    event?.stopPropagation();
    this.selectedCategory.set(null);
  }

  onSendForm(): void {
    if (!this.inputText().trim()) {
      return;
    }

    const message = this.inputText();
    this.inputText.set('');

    this.chatbotService.sendQuery(message, this.selectedCategory());
  }
}
