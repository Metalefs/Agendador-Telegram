import { Injectable } from '@nestjs/common';
import { getMessaging } from 'firebase-admin/messaging';
import { SubscriptionRepository } from '../../repository/subscription.repository';

@Injectable()
export class SubscriptionsService {
  constructor(protected repo: SubscriptionRepository) {
  }
  async register(subscription) {
    console.log({'Subscription received':subscription});
    return await this.repo.insert(subscription, false)
  }

  async sendFCMMessage(fcmToken: string, title:string, body:string): Promise<string> {
    try {
      const res = await getMessaging().send({
        notification: {
          title,
          body
        },
        token: fcmToken,
      });
      return res;
    } catch (e) {
      console.error('sendFCMMessage error', e);
    }
  }
}
