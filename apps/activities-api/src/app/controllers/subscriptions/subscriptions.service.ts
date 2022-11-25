import { Injectable } from '@nestjs/common';
import { getMessaging, Message } from 'firebase-admin/messaging';
import { SubscriptionRepository } from '../../repository/subscription.repository';

@Injectable()
export class SubscriptionsService {
  constructor(protected repo: SubscriptionRepository) {
  }
  async register(subscription) {
    console.log({'Subscription received':subscription});
    return await this.repo.insert(subscription, false)
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
