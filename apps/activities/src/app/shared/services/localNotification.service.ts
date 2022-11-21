import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';

import { TranslateService } from '@ngx-translate/core';
import { IActivity, WeekdayEnum } from '@uncool/shared';
import { environment } from 'apps/activities/src/environments/environment';

import { getWeekdayInNumber } from '../utils/calendar';

@Injectable({
  providedIn: 'root',
})
export class LocalNotificationService {
  private baseUrl = `${environment.endpoint}/notifications`;
  constructor(private http: HttpClient,
    private translate: TranslateService) {}

  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }

  getNotificationsForActivity(activity: IActivity): LocalNotificationSchema[] | null{
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
          text: activity.description,
          //icon: 'http://example.com/icon.png',
          data: { _id: activity._id },
          extra: { _id: activity._id },
          body: activity.description,
          id: (activity.id || activity.priority)||0 + weekday,
          sound: "beep.wav",
          // importance: 4,
          // vibration: true,
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
    console.log(notifications)
    return notifications;
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
}
