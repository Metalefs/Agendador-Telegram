import { IActivity } from '@uncool/shared';
import { Agenda } from 'agenda/es';
import { Db } from 'mongodb';
import { MongoClient } from "mongodb";
import { ActivityService } from '../services/activity.service';
import { SubscriptionService } from '../services/subscription.service';
import * as schedule from 'node-schedule'

export class NotificationScheduler {
  agenda:Agenda;
  constructor(private db:Db, client: MongoClient) {
    this.agenda = new Agenda({ mongo: client.db("agenda") });
  }

  start() {
    const activityService = new ActivityService(this.db);
    const subscriptionService = new SubscriptionService(this.db);

    this.agenda.define('check pending notifications', async (job) => {
      const notifications = await activityService.getPendingNotifications() as unknown as IActivity[];
      console.log("pending notifications: ", notifications.length)
      for(const notification of notifications) {
        const subscriptions = await subscriptionService.getUserSubscription(notification.userId);

        const dayOfWeek = new Date().getDay()
        const hour = new Date(notification.time).getHours();
        const minute = new Date(notification.time).getMinutes();

        const scheduleId = notification._id.toString();

        //If already scheduled, stop
        const my_job = schedule?.scheduledJobs[scheduleId];
        my_job?.cancel();

        console.log("scheduling:", scheduleId, {hour, minute, dayOfWeek})

        const j = schedule.scheduleJob(scheduleId, {hour, minute, dayOfWeek}, async()=>{
          for (const sb of subscriptions){
            if(sb.token)
              await subscriptionService.sendFCMNotification(sb, notification)
            else
              await subscriptionService.sendActivityNotification(sb.subscription, notification);
          }
        });

      }
    });

    (async () => {
      // IIFE to give access to async/await
      await this.agenda.start();

      await this.agenda.every('1 minute', 'check pending notifications');
    })();
  }

  async stop() {
    const numRemoved = await this.agenda.cancel({ name: 'check pending notifications' });
  }
}
