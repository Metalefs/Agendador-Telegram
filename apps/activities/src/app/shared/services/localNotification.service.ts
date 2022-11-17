import { Injectable } from '@angular/core';
import { ILocalNotification, LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';

@Injectable({
  providedIn: 'root',
})
export class LocalNotificationService {

  constructor(private localNotifications: LocalNotifications, private push: Push) { }


  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }

  Schedule(notifications:ILocalNotification[]){
    // Schedule multiple notifications
    this.localNotifications.schedule([{
      id: 1,
      text: 'Multi ILocalNotification 1',
      sound: this.isIos() ? 'file://beep.caf' : 'file://sound.mp3',
      //data: { secret: key }
    }, {
      id: 2,
      title: 'Local ILocalNotification Example',
      text: 'Multi ILocalNotification 2',
      icon: 'http://example.com/icon.png',
      led: 'FF0000',
    }]);
  }
}
