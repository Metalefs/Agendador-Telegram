import { Module } from '@nestjs/common';
import { Db } from 'mongodb';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { ActivitiesController } from './controllers/activities/activities.controller';
import { ActivitiesService } from './controllers/activities/activities.service';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './controllers/auth/auth.service';
import { UserService } from './services/user.service';

import { MongoClient } from 'mongodb';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriptionsController } from './controllers/subscriptions/subscriptions.controller';
import { SubscriptionsService } from './controllers/subscriptions/subscriptions.service';
import { ActivityRepository } from './repository/activity.repository';
import { SubscriptionRepository } from './repository/subscription.repository';
import { ScheduleService } from './services/schedule.service';
import { SettingsService } from './controllers/settings/settings.service';
import { UserSettingsRepository } from './repository/userSettings.repository';
import { SettingsController } from './controllers/settings/settings.controller';
import { initBot } from './telegram';
import { TelegramService } from './services/telegram.service';
import { NotificationScheduler } from './routines/notificationSchedule';
import { KeepAliveScheduler } from './routines/pingApp';
import { PurgeSubscriptionsScheduler } from './routines/purgeSubscriptions';
import { ChronogramsController } from './controllers/chronograms/chronograms.controller';
import { ChronogramsService } from './controllers/chronograms/chronograms.service';
import { ChronogramRepository } from './repository/chronogram.repository';

@Module({
  imports: [
     ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'activities'),
      exclude: ['/activities-api*']
    })
  ],
  controllers: [ActivitiesController, ChronogramsController, AuthController, AppController, SubscriptionsController, SettingsController],
  providers: [
    SubscriptionsService,
    ActivitiesService,
    ChronogramsService,
    ScheduleService,
    AuthService,
    UserService,
    AppService,
    ActivityRepository,
    SubscriptionRepository,
    SettingsService,
    UserSettingsRepository,
    ChronogramRepository,
    TelegramService,
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (): Promise<Db> => {
        console.log('Connecting...');
        const client = new MongoClient(process.env.DBURL);
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db('mealprep');
        await new KeepAliveScheduler(db,client).start()
        await new PurgeSubscriptionsScheduler(db,client).start()
        return db
      }
    },
    {
      provide: 'TELEGRAM_BOT',
      useFactory: async () => {
        const db = new MongoClient(process.env.DBURL).db('mealprep');
        const bot = initBot();
        await new NotificationScheduler(db, bot).start()
        return bot
      }
    }
  ],
  exports: ['DATABASE_CONNECTION','TELEGRAM_BOT'],
})
export class AppModule
{

}
