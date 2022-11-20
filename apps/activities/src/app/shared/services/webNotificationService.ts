import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { environment } from 'apps/activities/src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class WebNotificationService {
  private baseUrl = `${environment.endpoint}/notifications`;
  constructor(private http: HttpClient,
              private swPush: SwPush,
              private swUpdate: SwUpdate) {}


  subscribeToNotification() {
    this.swPush.requestSubscription({
        serverPublicKey: environment.VAPID_PUBLIC_KEY
    })
    .then(sub => this.sendToServer(sub))
    .catch(err => console.error('Could not subscribe to notifications', err));


    this.swUpdate.versionUpdates.subscribe((update: any) => {
      console.log("Nova versão disponível");
    });

    this.swPush.messages.subscribe((msg: any) => {
      console.log(JSON.stringify(msg));
    })
  }

  sendToServer(notification: any) {
    this.http.post(this.baseUrl, { notification }).subscribe();
  }
}
