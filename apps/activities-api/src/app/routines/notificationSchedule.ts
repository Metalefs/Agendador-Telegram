import { IActivity } from '@uncool/shared';
//import { Agenda } from 'agenda/es';
import { Db } from 'mongodb';
import { ActivitiesService } from '../controllers/activities/activities.service';
import { SettingsService } from '../controllers/settings/settings.service';
import { ActivityRepository } from '../repository/activity.repository';
import { UserSettingsRepository } from '../repository/userSettings.repository';
//import { MongoClient } from "mongodb";
import { ScheduleService } from '../services/schedule.service';
import { TelegramService } from '../services/telegram.service';

export class NotificationScheduler {
  //agenda:Agenda;
  telegramService:TelegramService
  scheduleService:ScheduleService
  activityService:ActivitiesService
  constructor(private db:Db, private bot/*, client: MongoClient*/) {
    //this.agenda = new Agenda({ mongo: client.db("agenda") });
  }

  async start() {
    this.telegramService = new TelegramService(this.bot, new SettingsService(new UserSettingsRepository(this.db)))
    this.scheduleService = new ScheduleService(this.db, this.telegramService);
    this.activityService = new ActivitiesService(new ActivityRepository(this.db),  new ScheduleService(this.db, null));

    //this.agenda.define('check pending notifications', async (job) => {
      const activities = await this.activityService.getAll() as unknown as IActivity[];
      console.log("pending notifications: ", activities.length)
      for(const activity of activities) {
       await this.scheduleService.scheduleActivityNotification(activity)
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
