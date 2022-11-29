import { Agenda } from 'agenda/es';
import { Db } from 'mongodb';
import { MongoClient } from "mongodb";
import { SubscriptionsService } from '../controllers/subscriptions/subscriptions.service';
import { SubscriptionRepository } from '../repository/subscription.repository';

export class PurgeSubscriptionsScheduler {
  agenda: Agenda;
  constructor(private db: Db, client: MongoClient) {
    this.agenda = new Agenda({ mongo: client.db("agenda") });
  }

  async start() {
    this.agenda.define('purge subscriptions', async (job) => {
      const subscriptionService = new SubscriptionsService(new SubscriptionRepository(this.db));
      await subscriptionService.purgeSubscriptions();
    });

    (async () => {
      // IIFE to give access to async/await
      await this.agenda.start();

      await this.agenda.every('1 week', 'purge subscriptions');
    })();
  }

  async stop() {
    const numRemoved = await this.agenda.cancel({ name: 'ping app' });
  }
}
