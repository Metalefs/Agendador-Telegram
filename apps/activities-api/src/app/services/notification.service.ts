import { Injectable } from '@nestjs/common';
import { IActivity } from '@uncool/shared';
import { messaging } from 'firebase-admin';
import { TokenMessage, WebpushConfig } from 'firebase-admin/messaging';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpush = require('web-push');

@Injectable()
export class NotificationService {

  async sendActivityNotificationWebpush(subscription, activity: IActivity) {
    const message = this.getWebpushConfig(activity);
    console.log('sending webpush:',message)
    return webpush.sendNotification(subscription, message)
      .catch(error => console.error(error));
  }

  async sendActivityNotificationFCM(subscription, activity: IActivity) {
    const message: TokenMessage = {
      webpush: this.getWebpushConfig(activity),
      "notification": {
        "title": activity.type + " - " + activity.title,
        "body": activity.description
      },
      data: {
        activity: JSON.stringify(activity),
        url: 'https://mealprepscheduler.herokuapp.com'
      },
      apns: {
        payload: {
          aps:{
            badge: 42,
            title:  activity.type + " - " + activity.title,
            subtitle: activity.type,
            body: activity.description ?? '',
            launchImage: 'https://mealprepscheduler.herokuapp.com/assets/icons/bg.webp',
          }
        },
        fcmOptions: {
          imageUrl: 'https://mealprepscheduler.herokuapp.com/assets/icons/bg.webp'
        },
      },
      android: {
        priority: 'high',
        ttl: 1800 * 1000,
        notification: {
          channelId: 'mealprep',
          "title": activity.type + " - " + activity.title,
          "body": activity.description ?? '',
          priority: 'max',
          defaultVibrateTimings: true,
          visibility: 'public',
          clickAction: 'activities',
          color: '#f45342',
          icon:'https://mealprepscheduler.herokuapp.com/assets/icons/task-done-flat.png',
          imageUrl: 'https://mealprepscheduler.herokuapp.com/assets/icons/bg.webp'
        }
      },
      "token": subscription.token,
    };

    console.log('sending message',{message})

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
        "title": activity.type + " - " + activity.title,
        "body": activity.description ?? '',
        "vibrate": [100, 50, 100],
        "actions": [{
          "action": "explore",
          "title": "Visitar o site"
        }],
        data: {
          activity: JSON.stringify(activity),
          url: 'https://mealprepscheduler.herokuapp.com'
        },
        icon: 'https://mealprepscheduler.herokuapp.com/assets/icons/task-done-flat.png'
      }
    } as WebpushConfig
  }
}
