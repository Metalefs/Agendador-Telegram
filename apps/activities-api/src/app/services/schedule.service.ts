import * as schedule from 'node-schedule'
import { IActivity } from "@uncool/shared";
import { Inject, Injectable } from "@nestjs/common";
import { Db } from "mongodb";
import { SubscriptionsService } from '../controllers/subscriptions/subscriptions.service';
import { SubscriptionRepository } from '../repository/subscription.repository';
import { NotificationService } from './notification.service';

@Injectable()
export class ScheduleService {
  subscriptionService:SubscriptionsService;
  notificationService:NotificationService;
  constructor(@Inject('DATABASE_CONNECTION') protected db: Db){
    this.subscriptionService = new SubscriptionsService(new SubscriptionRepository(this.db));
    this.notificationService = new NotificationService();
  }

  async scheduleActivityNotification(activity:IActivity) {
    const dayOfWeek = new Date().getDay()
    const hour = new Date(activity.time).getUTCHours();
    const minute = new Date(activity.time).getUTCMinutes();

    const scheduleId = activity._id.toString();

    //If already scheduled, stop
    const my_job = schedule?.scheduledJobs[scheduleId];
    my_job?.cancel();

    console.log("scheduling:", scheduleId, { hour, minute, dayOfWeek })

    schedule.scheduleJob(scheduleId, { hour, minute, dayOfWeek }, async () => {
      const subscriptions = await this.subscriptionService.getUserSubscription(activity.userId);
      for (const sb of subscriptions) {
        if (sb.token)
          await this.notificationService.sendActivityNotificationFCM(sb, activity)
        else
          await this.notificationService.sendActivityNotificationWebpush(sb.subscription, activity);
      }
    });
  }

  cancelActivitySchedule(id:string){
    const my_job = schedule?.scheduledJobs[id];
    my_job?.cancel();
  }
}
