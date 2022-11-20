import { Body, Controller, Get, Post, Req, UseInterceptors } from '@nestjs/common';
import { AuthInterceptor } from '../../middlewares/auth.interceptor';

import { NotificationsService } from './notifications.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpush = require('web-push');

@Controller('notifications')
@UseInterceptors(AuthInterceptor)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('/')
  notification(@Body() body) {
    const subscription = body.notification;
    const notification = this.notificationsService.register(subscription);

    webpush.sendNotification(subscription, notification)
    .catch(error => console.error(error));
  }
}
