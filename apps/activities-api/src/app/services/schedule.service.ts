import * as schedule from 'node-schedule'
import { IActivity } from "@uncool/shared";
import { Inject, Injectable } from "@nestjs/common";
import { Db } from "mongodb";
import { SubscriptionsService } from '../controllers/subscriptions/subscriptions.service';
import { SubscriptionRepository } from '../repository/subscription.repository';
import { NotificationService } from './notification.service';
import * as moment from 'moment';
import { activityWeekDaysToDate } from '../controllers/activities/activities.service';

@Injectable()
export class ScheduleService {
  subscriptionService:SubscriptionsService;
  notificationService:NotificationService;
  constructor(@Inject('DATABASE_CONNECTION') protected db: Db){
    this.subscriptionService = new SubscriptionsService(new SubscriptionRepository(this.db));
    this.notificationService = new NotificationService();
    //moment().locale('pt-BR');
    //moment.tz.add('America/Sao_Paulo|LMT -03 -02|36.s 30 20|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2glwR.w HdKR.w 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 pTd0 PX0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 1EN0 Lz0 1C10 IL0 1HB0 Db0 1HB0 On0 1zd0 On0 1zd0 Lz0 1zd0 Rb0 1wN0 Wn0 1tB0 Rb0 1tB0 WL0 1tB0 Rb0 1zd0 On0 1HB0 FX0 1C10 Lz0 1Ip0 HX0 1zd0 On0 1HB0 IL0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1HB0 FX0|20e6');
    this.sendActivityNotification = this.sendActivityNotification.bind(this);
  }

  async scheduleActivityNotification(activity:IActivity) {
    const dayOfWeek = activityWeekDaysToDate(activity.weekdays)

    const brazil = moment(activity.time);
    const hour = brazil.hours();
    const minute = brazil.minutes();

    const scheduleId = activity._id.toString();

    //If already scheduled, stop
    const my_job = schedule?.scheduledJobs[scheduleId];
    my_job?.cancel();

    console.log("scheduling:", scheduleId, { hour, minute, dayOfWeek })

    schedule.scheduleJob(scheduleId, { hour, minute, dayOfWeek }, this.sendActivityNotification.bind(this, activity));
  }

  async sendActivityNotification(...args){
    console.log({args})
    const subscriptions = await this.subscriptionService.getUserSubscription(args[0].userId);

    for (const sb of subscriptions) {
      if (sb.token)
        await this.notificationService.sendActivityNotificationFCM(sb, args[0])
      else
        await this.notificationService.sendActivityNotificationWebpush(sb.subscription, args[0]);
    }
  }

  cancelActivitySchedule(id:string){
    const my_job = schedule?.scheduledJobs[id];
    my_job?.cancel();
  }
}
