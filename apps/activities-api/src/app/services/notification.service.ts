import { Injectable } from '@nestjs/common';
import { IActivity } from '@uncool/shared';
import { messaging } from 'firebase-admin';
import { TokenMessage, WebpushConfig } from 'firebase-admin/messaging';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpush = require('web-push');

@Injectable()
export class NotificationService {

  async sendActivityNotificationWebpush(subscription, activity: IActivity) {
    return webpush.sendNotification(subscription, this.getWebpushConfig(activity))
      .catch(error => console.error(error));
  }

  async sendActivityNotificationFCM(subscription, activity: IActivity) {
    const message: TokenMessage = {
      webpush: this.getWebpushConfig(activity),
      "notification": {
        "title": activity.type + " - " + activity.title,
        "body": activity.description
      },
      android: {
        priority: 'high',
        notification: {
          priority: 'high',
          defaultVibrateTimings: true,
          defaultSound: true,
          visibility: 'public',
          clickAction: 'mealprepactivities'
        }
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

  private getWebpushConfig(activity: IActivity):WebpushConfig{
    return {
      "notification": {
        "title": activity.time,
        "body": activity.description,
        "vibrate": [100, 50, 100],
        "actions": [{
          "action": "explore",
          "title": "Visitar o site"
        }],
      }
    } as WebpushConfig
  }
}