import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { ChatbotIcons } from './models/chatbot';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ChatbotComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly chatbotIcons: ChatbotIcons = {
    agent: 'assets/agent.svg',
    user: 'assets/user.svg',
  };
}
