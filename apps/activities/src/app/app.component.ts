import { Component, OnInit } from '@angular/core';
import { LanguageService } from './shared/services/language-service';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { CheckForUpdateService } from './shared/services/checkForUpdatesService';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ConnectivityService } from './shared/services/connectivity.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  updateAvailable = false;
  constructor(private languageService: LanguageService, private swPush: SwPush, private updates: SwUpdate,
    private checkForUpdateService: CheckForUpdateService, private alertController: AlertController, private translate: TranslateService, private connectivity: ConnectivityService) {
    this.languageService.loadLanguage();
    this.swPush.notificationClicks.subscribe(event => {
      console.log('Received notification: ', event);
      const url = event.notification.data.url;
      window.open(url, '_blank');
    });
    this.updates.versionUpdates.subscribe((event) => {
      this.updateAvailable = true;
    });
  }

  async ngOnInit(){
    this.connectivity.status.subscribe(async (status)=>{
      if(!status){
        const alert = await this.alertController.create({
          header: 'Offline',
          message: await this.translate.get('connectivity.offline.message').toPromise(),
          buttons: [
            {
              text: 'OK',
            }
          ]
        });
        await alert.present();
      }
      else{
        const alert = await this.alertController.create({
          header: 'Online',
          message: await this.translate.get('connectivity.online.message').toPromise(),
          buttons: [
            {
              text: 'OK',
            }
          ]
        });
        await alert.present();
      }
    })
  }
}
