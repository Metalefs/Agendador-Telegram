import { Agenda } from 'agenda/es';
import { Db } from 'mongodb';
import { MongoClient } from "mongodb";
import { ActivityService } from '../services/activity.service';
import { SubscriptionService } from '../services/subscription.service';

export class NotificationScheduler {
  agenda;
  constructor(private db:Db, client: MongoClient) {
    this.agenda = new Agenda({ mongo: client.db("agenda") });
  }

  start() {
    const activityService = new ActivityService(this.db);
    const subscriptionService = new SubscriptionService(this.db);

    this.agenda.define('check pending notifications', async (job) => {
      const notifications = await activityService.getPendingNotifications();

      for(const notification of notifications) {
        const subscription = await subscriptionService.getUserSubscription(notification.userId) as any;
        if(subscription.token)
          await subscriptionService.sendFCMNotification(subscription, notification)
        else
          await subscriptionService.sendNotification(subscription.subscription, notification);
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
