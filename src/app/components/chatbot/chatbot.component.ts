import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { filter, fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatbotIcons } from '../../models/chatbot';
import { ChatbotIcon } from '../chatbot-icon/chatbot-icon.component';
import { ChatbotTextbox } from '../chatbot-textbox/chatbot-textbox.component';

const ESCAPE_KEY = 'Escape';

@Component({
  selector: 'chatbot',
  imports: [ChatbotTextbox, ChatbotIcon],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss',
})
export class ChatbotComponent implements OnInit, OnDestroy {
  @Input() icons!: ChatbotIcons;

  showTextBox = signal(false);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.subscribeToKeyboardEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onChatbotClicked(): void {
    this.showTextBox.set(true);
  }

  onCloseChatbot(): void {
    this.showTextBox.set(false);
  }

  private subscribeToKeyboardEvents(): void {
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter((event) => event.key === ESCAPE_KEY),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.showTextBox.set(false));
  }
}
