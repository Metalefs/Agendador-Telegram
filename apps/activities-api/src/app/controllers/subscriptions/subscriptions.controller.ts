import { Body, Controller, Get, Post, Req, UseInterceptors } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { AuthInterceptor } from '../../middlewares/auth.interceptor';
import { SubscriptionsService } from './subscriptions.service';
import { messaging } from "firebase-admin";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpush = require('web-push');

@Controller('notifications')
@UseInterceptors(AuthInterceptor)
export class SubscriptionsController {
  constructor(private readonly notificationsService: SubscriptionsService) {}

  @Post('/')
  async notification(@Req() request: Request) {
    const subscription = (request.body as any).notification;
    const userId = new ObjectId((request as any).user);
    subscription.userId = userId;
    subscription.type = 'webpush';

    await this.notificationsService.register(subscription);

    const payload = JSON.stringify({
      "notification": {
        "title": "Inscrição realizada com sucesso",
        "body": "Notificações configuradas",
        "vibrate": [100, 50, 100],
        "actions": [{
          "action": "explore",
          "title": "Visitar o site"
        }]
      }
    })

    webpush.sendNotification(subscription,payload)
    .catch(error => console.error(error));
  }
  @Post('/fcm')
  async notificationFCM(@Req() request: Request) {
    console.log(request.body);
    const subscription = (request.body as any).notification;
    const token = (request.body as any).token;
    const userId = new ObjectId((request as any).user);
    subscription.userId = userId;
    subscription.type = 'fcm';
    await this.notificationsService.register(subscription);
    this.notificationsService.sendFCMMessage(token,
      {
        notification: {
          "body": "Notificações configuradas",
          "title": "Inscrição realizada com sucesso",
        },
        token
      }
    )
  }
}
