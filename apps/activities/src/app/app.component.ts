import { Component } from '@angular/core';
import { LanguageService } from './shared/services/language-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private languageService: LanguageService) {
    this.languageService.loadLanguage();
  }
}
