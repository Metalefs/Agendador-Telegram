
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'apps/activities/src/environments/environment';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Device } from '@capacitor/device';
import { AlertController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

@Injectable({
  providedIn: 'root',
})
export class PushNofiticationService {
  private baseUrl = `${environment.endpoint}/notifications`;
  constructor(private http: HttpClient,
    private alertController: AlertController) { }

  initPushNotifications() {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(async (result: { receive: string; }) => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      this.sendToServer(token.value);
      //alert('Push registration success, token: ' + token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      alert('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
        const data = notification;
        const alert = await this.alertController.create({
          header: JSON.stringify(notification.title).substring(1, JSON.stringify(notification.title).length - 1),
          message: JSON.stringify(notification.body).substring(1, JSON.stringify(notification.body).length - 1),
          buttons: [
            {
              text: 'OK',
              handler: async () => {
                if (data.data.url != '' && data.data.url != undefined) {
                  //const browser = this.iab.create(data.data.url, '_blank', { location: 'no' });
                  await Browser.open({ url: data.data.url });
                }
              }

            }
          ]
        });
        await alert.present();
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data;
        console.log('Action performed: ' + JSON.stringify(notification.notification));

        if (data.url) {
          if (data.url != '' && data.url != undefined) {
            await Browser.open({ url: data.data.url });
          }
        }

      }
    );
  }

  resetBadgeCount() {
    Device.getInfo().then(res => {
      if (res.platform !== 'web') {
        PushNotifications.removeAllDeliveredNotifications();
      }
    });
  }

  sendToServer(token: any) {
    this.http.post(this.baseUrl, { token }).subscribe();
  }
}
