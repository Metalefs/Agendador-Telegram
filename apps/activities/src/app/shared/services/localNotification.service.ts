import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';

import { TranslateService } from '@ngx-translate/core';
import { IActivity } from '@uncool/shared';
import { environment } from 'apps/activities/src/environments/environment';

import { getWeekdayInNumber } from '../utils/calendar';

@Injectable({
  providedIn: 'root',
})
export class LocalNotificationService {
  private baseUrl = `${environment.endpoint}/notifications`;
  constructor(private http: HttpClient,
    private translate: TranslateService) {

    LocalNotifications.createChannel({
      id: 'mealprep',
      name: 'Mealprep activities',
      description: 'Sua agenda',
      sound: 'ping.mp3',
      importance: 4,
      visibility: 1,
      vibration: true,
    })
  }

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }

  async schedule(activities: IActivity[] | IActivity) {
    let notifications:LocalNotificationSchema[] = []
    if ((activities as Array<IActivity>)?.forEach)
      for (const activitiy of activities as any){
        this.getNotificationsForActivity(activitiy as IActivity)?.forEach(notification => {
          if(notification)
            notifications.push(notification)
        })
      }
    else
      this.getNotificationsForActivity(activities as IActivity)?.forEach(notification => {
        if(notification)
            notifications.push(notification)
      });

    await LocalNotifications.schedule({
      notifications: notifications.filter(x => !!x) as any
    });
  }

  async cancelPending() {
    const pending = await LocalNotifications.getPending();

    if(pending)
    await LocalNotifications.cancel({notifications: pending.notifications});
  }

  private getNotificationsForActivity(activity: IActivity): LocalNotificationSchema[] | null{
    const activityDate = new Date(activity.time!);
    const date = new Date();
    date.setHours(activityDate.getHours())
    date.setMinutes(activityDate.getMinutes())

    const notifications:LocalNotificationSchema[] = [];

    activity.weekdays?.forEach((day:string)=>{
      const weekday = getWeekdayInNumber(day);

      notifications.push(
        {
          title: this.translate.instant('activities.'+activity.type!)+ " - " + activity.title,
          body: activity.description,
          largeIcon: 'https://mealprepscheduler.herokuapp.com/assets/icons/task-done-flat.png',
          smallIcon: 'https://mealprepscheduler.herokuapp.com/assets/icons/task-done-flat.png',
          data: { activity },
          extra: { activity },
          id: activity.id,
          importance: 4,
          channelId: 'mealprep',
          vibration: true,
          schedule: {
            allowWhileIdle: true,
            at: date,
            repeats: true,
            on: {
              weekday
            }
          }
        } as LocalNotificationSchema
      )
    })
    return notifications;
  }
}
