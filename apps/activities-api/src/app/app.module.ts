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

@Module({
  imports: [
     ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'activities'),
      exclude: ['/activities-api*']
    })
  ],
  controllers: [ActivitiesController, AuthController, AppController, SubscriptionsController, SettingsController],
  providers: [
    SubscriptionsService,
    ActivitiesService,
    ScheduleService,
    AuthService,
    UserService,
    AppService,
    ActivityRepository,
    SubscriptionRepository,
    SettingsService,
    UserSettingsRepository,
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (): Promise<Db> => {
        console.log('Connecting...');
        const client = new MongoClient(process.env.DBURL);
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db('mealprep');
        return db
      }
    }
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class AppModule
{

}
