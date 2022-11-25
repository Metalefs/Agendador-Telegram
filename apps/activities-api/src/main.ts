// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpush = require('web-push');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NotificationScheduler } from './app/routines/notificationSchedule';
import { dbconnection } from './database';
import { googleCredentials } from './env';
import * as fs from "fs";


const admin = require('firebase-admin');

fs.writeFileSync('./google-credentials.json', googleCredentials);
// const serviceAccount = require("./google-credentials.json");
admin.initializeApp({
  credential: admin.credential.cert(googleCredentials)
});

async function bootstrap() {

  const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
  const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
  webpush.setVapidDetails('mailto:jackson.pires.rm@gmail.com', publicVapidKey, privateVapidKey);

  const [db,con,client] = await dbconnection();
  new NotificationScheduler(db as any, client as any).start()

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
