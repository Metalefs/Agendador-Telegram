import { Injectable } from '@nestjs/common';
import { getMessaging } from 'firebase-admin/messaging';
import moment = require('moment');
import { ObjectId } from 'mongodb';
import { SubscriptionRepository } from '../../repository/subscription.repository';

@Injectable()
export class SubscriptionsService {
  constructor(protected repo: SubscriptionRepository) {
  }
  async register(subscription) {
    console.log({'Subscription received':subscription});
    const existing = await this.repo.find({token: subscription.token});
    if(existing.length > 1) return;

    return this.repo.insert(subscription, false)
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

  getUserSubscription(userId) {
    return this.repo.find({ userId: new ObjectId(userId) })
  }

  purgeSubscriptions(){
    return this.repo.removeByFilter({ date: {$lt: moment().subtract(1, 'week').toDate() } })
  }

}
