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
      apns: {
        payload: {
          aps:{
            badge: 42,
            title:  activity.type + " - " + activity.title,
            subtitle: activity.type,
            body: activity.description ?? '',
            launchImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1039&q=80',
          }
        },
        fcmOptions: {
          imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1039&q=80'
        },
      },
      android: {
        priority: 'high',
        ttl: 1800 * 1000,
        notification: {
          "title": activity.type + " - " + activity.title,
          "body": activity.description ?? '',
          priority: 'high',
          defaultVibrateTimings: true,
          visibility: 'public',
          clickAction: 'activities',
          color: '#f45342',
          icon:'https://freeiconshop.com/wp-content/uploads/edd/task-done-flat.png',
          imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1039&q=80'
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
        icon: 'https://freeiconshop.com/wp-content/uploads/edd/task-done-flat.png'
      }
    } as WebpushConfig
  }
}
