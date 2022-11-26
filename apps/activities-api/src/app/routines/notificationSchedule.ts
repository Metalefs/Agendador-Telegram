import { Agenda } from 'agenda/es';
import { Db } from 'mongodb';
import { MongoClient } from "mongodb";
import { ActivityService, parseActivityDay } from '../services/activity.service';
import { SubscriptionService } from '../services/subscription.service';
const cron = require('cron').CronJob;

export class NotificationScheduler {
  agenda:Agenda;
  constructor(private db:Db, client: MongoClient) {
    this.agenda = new Agenda({ mongo: client.db("agenda") });
  }

  start() {
    const activityService = new ActivityService(this.db);
    const subscriptionService = new SubscriptionService(this.db);

    this.agenda.define('check pending notifications', async (job) => {
      const notifications = await activityService.getPendingNotifications();

      for(const notification of notifications) {
        const subscriptions = await subscriptionService.getUserSubscription(notification.userId) as any;

        const dayOfWeek = notification.weekdays.map(x=>parseActivityDay(x)).flat().join(",");
        const hours = new Date(notification.time).getHours();
        const minutes = new Date(notification.time).getMinutes();

        const scheduleId = notification._id.toString();
        const scheduleTimeout = `${minutes} ${hours} * * ${dayOfWeek}`;

        //If already scheduled, stop
        const my_job = cron.scheduledJobs[scheduleId];
        my_job?.stop();


        const j = cron.scheduleJob(scheduleId, scheduleTimeout, async()=>{
          for (const sb of subscriptions){
            if(sb.token)
              await subscriptionService.sendFCMNotification(sb, notification)
            else
              await subscriptionService.sendNotification(sb.subscription, notification);
          }
        }, true);
        j.start();

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
