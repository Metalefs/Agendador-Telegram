import { Component } from '@angular/core';
import { LanguageService } from './shared/services/language-service';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { CheckForUpdateService } from './shared/services/checkForUpdatesService';
import { WebNotificationService } from './shared/services/webNotificationService';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  updateAvailable = false;
  constructor(private languageService: LanguageService, private swPush: SwPush, private updates: SwUpdate,
    private checkForUpdateService: CheckForUpdateService, private webNotificationService: WebNotificationService) {
    this.languageService.loadLanguage();
    this.webNotificationService.subscribeToNotification();
    this.swPush.notificationClicks.subscribe(event => {
      console.log('Received notification: ', event);
      const url = event.notification.data.url;
      window.open(url, '_blank');
    });
    this.updates.versionUpdates.subscribe((event) => {
      this.updateAvailable = true;
      alert('new version available')
    });
  }
}
