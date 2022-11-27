import { IActivity } from '@uncool/shared';
//import { Agenda } from 'agenda/es';
import { Db } from 'mongodb';
import { ActivitiesService } from '../controllers/activities/activities.service';
import { ActivityRepository } from '../repository/activity.repository';
//import { MongoClient } from "mongodb";
import { ScheduleService } from '../services/schedule.service';

export class NotificationScheduler {
  //agenda:Agenda;
  constructor(private db:Db/*, client: MongoClient*/) {
    //this.agenda = new Agenda({ mongo: client.db("agenda") });
  }

  async start() {
    const scheduleService = new ScheduleService(this.db);
    const activityService = new ActivitiesService(new ActivityRepository(this.db), scheduleService);

    //this.agenda.define('check pending notifications', async (job) => {
      const activities = await activityService.getPendingActivities() as unknown as IActivity[];
      console.log("pending notifications: ", activities.length)
      for(const activity of activities) {
       await scheduleService.scheduleActivityNotification(activity)
      }
    //});

    // (async () => {
    //   // IIFE to give access to async/await
    //   await this.agenda.start();

    //   await this.agenda.every('1 day', 'check pending notifications');
    // })();
  }

  // async stop() {
  //   const numRemoved = await this.agenda.cancel({ name: 'check pending notifications' });
  // }
}
