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

@Module({
  imports: [
     ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'activities'),
      exclude: ['/activities-api*']
    })
  ],
  controllers: [ActivitiesController, AuthController, AppController],
  providers: [
    ActivitiesService,
    AuthService,
    UserService,
    AppService,
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (): Promise<Db> => {
        console.log('Connecting...');
        const mongoConnectionString = process.env.DBURL;
        const client = new MongoClient(mongoConnectionString);
        const connection = await client.connect();
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
