require('dotenv').config()
import { Db, ObjectId } from 'mongodb';
import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionRepository } from '../repository/subscription.repository';
import { messaging } from "firebase-admin";
import { TokenMessage } from 'firebase-admin/messaging';
import { IActivity } from '@uncool/shared';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpush = require('web-push');

@Injectable()
export class SubscriptionService {

  repo: SubscriptionRepository;
  constructor(@Inject('DATABASE_CONNECTION') protected db: Db) {
    this.repo = new SubscriptionRepository(db)
  }

  getUserSubscription(userId) {
    return this.repo.find({ userId: new ObjectId(userId) })
  }

  async sendActivityNotification(subscription, activity:IActivity) {
    const _notification = {
      "notification": {
        "title": activity.time,
        "body": activity.description,
        "vibrate": [100, 50, 100],
        "actions": [{
          "action": "explore",
          "title": "Visitar o site"
        }]
      }
    }
    return webpush.sendNotification(subscription, _notification)
      .catch(error => console.error(error));
  }

  async sendFCMNotification(subscription, activity:IActivity) {
    const message: TokenMessage = {
      "notification": {
        "title": activity.title,
        "body": activity.description
      },
      "token": subscription.token,
    };

    await messaging().send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }
};
