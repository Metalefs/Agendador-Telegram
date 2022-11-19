import { Injectable } from '@angular/core';
import { ELocalNotificationTriggerUnit, ILocalNotification, LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { IActivity } from '@uncool/shared';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class LocalNotificationService {

  constructor(private localNotifications: LocalNotifications) { }


  isIos() {
    const win = window as any;
    return win && win.Ionic && win.Ionic.mode === 'ios';
  }

  getNotificationForActivity(activity: IActivity) {
    const activityDate = new Date(activity.time!);
    const date = new Date();
    date.setHours(activityDate.getHours())
    date.setMinutes(activityDate.getMinutes())
    if (moment(date).isBefore(new Date())) return;

    const trigger = moment(date).fromNow();
    return {
      id: activity.priority,
      title: activity.title,
      text: activity.description,
      //icon: 'http://example.com/icon.png',
      led: 'FF0000',
      data: { _id: activity._id },
      trigger: { at: date, unit: ELocalNotificationTriggerUnit.DAY },
      wakeup: true,
      priority: 1,
    } as ILocalNotification
  }

  scheduleTest() {
    this.localNotifications.schedule(
      {
        id: 10,
        title: 'teste',
        text: 'activity.description',
        //icon: 'http://example.com/icon.png',
        led: 'FF0000',
        trigger: { in: 5, unit: ELocalNotificationTriggerUnit.SECOND },
        wakeup: true,
        priority: 1
      });
  }

  schedule(activities: IActivity[] | IActivity) {
    let notifications = []
    if ((activities as Array<IActivity>)?.forEach)
      for (const activitiy of activities as any)
        notifications.push(this.getNotificationForActivity(activitiy as IActivity))
    else
      notifications.push(this.getNotificationForActivity(activities as IActivity));

    this.localNotifications.schedule(notifications.filter(x => !!x) as any);
  }
}
