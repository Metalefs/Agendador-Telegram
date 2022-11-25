import { Injectable } from '@nestjs/common';
import { getMessaging, Message } from 'firebase-admin/messaging';
import { SubscriptionRepository } from '../../repository/subscription.repository';

@Injectable()
export class SubscriptionsService {
  constructor(protected repo: SubscriptionRepository) {
  }
  async register(subscription) {
    if (subscription.endpoint){
      await this.repo.insert(subscription, false)
    }
    console.log({'Subscription received':subscription});
    const payload = JSON.stringify({
      "notification": {
        "title": "Inscrição realizada com sucesso",
        "body": "Notificações configuradas",
        "vibrate": [100, 50, 100],
        "actions": [{
          "action": "explore",
          "title": "Visitar o site"
        }]
      }
    })
    return payload;
  }

  async sendFCMMessage(fcmToken: string, msg: Message): Promise<string> {
    try {
      const res = await getMessaging().send({
        webpush: {
          notification: {
            ...msg,
            requireInteraction: msg.webpush.notification.requireInteraction ?? false,
            actions: [{
              title: 'Open',
              action: 'open',
            }],
            data: {

            },
          },
        },
        token: fcmToken,
      });
      return res;
    } catch (e) {
      console.error('sendFCMMessage error', e);
    }
  }
}
