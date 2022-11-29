import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { environment } from 'apps/activities/src/environments/environment';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Plugins } from '@capacitor/core'
const { CapacitorAlarmNotification } = Plugins;
import { LocalNotificationService } from './localNotification.service';
@Injectable({
  providedIn: 'root',
})
export class WebNotificationService {
  private baseUrl = `${environment.endpoint}/notifications/fcm`;
  constructor(private http: HttpClient,
    private swPush: SwPush,
    private swUpdate: SwUpdate,
    private afMessaging: AngularFireMessaging,
    private localNotificationService: LocalNotificationService) { }


  subscribeToNotification() {
    this.afMessaging.requestPermission
      .subscribe(
        () => { console.log('permission granted') },
        (error) => { console.error(error); },
      );
    this.swPush.requestSubscription({
      serverPublicKey: environment.VAPID_PUBLIC_KEY
    })
      .then(sub => this.sendToServer(sub))
      .catch(err => console.error('Could not subscribe to notifications', err));


    this.swUpdate.versionUpdates.subscribe((update: any) => {
      console.log("Nova versão disponível");
    });

    this.swPush.messages.subscribe((msg: any) => {
      console.log({ "Message Received": JSON.stringify(msg) });
    })

    // Callback fired if Instance ID token is updated.
    this.afMessaging.tokenChanges.subscribe(() => {
      this.afMessaging.getToken.subscribe((refreshedToken) => {
        console.log('Token refreshed.', refreshedToken);
      })
    });

    this.afMessaging.messages
      .subscribe(async (message: any) => {
        console.log({ "afMessaging Message received": message });
        const NotificationOptions = {
          body: message.notification.body,
          data: message.data,
          icon: message.notification.icon
        }
        navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope').then(registration => {
          registration?.showNotification(message.notification.title, NotificationOptions);
        });
        await this.localNotificationService.schedule(message.data.activity);
        CapacitorAlarmNotification?.['setAlarm']({
          sec: 1,
          sound: true, // false: vibration only, true: ring system alarm sound
          title: message.notification.title,  // notification title
          text: message.notification.body  // notification text
        })
      });
  }

  sendToServer(notification: any) {
    this.afMessaging.getToken.subscribe((token) => {
      console.log('Token: ', token);
      this.http.post(this.baseUrl, { notification, token }).subscribe();
    })
  }
}
