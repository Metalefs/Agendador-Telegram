import * as schedule from 'node-schedule'
import { IActivity, IUserSettings, RemindOffsetType, RepeatIntervalType } from "@uncool/shared";
import { Inject, Injectable } from "@nestjs/common";
import { Db } from "mongodb";
import { SubscriptionsService } from '../controllers/subscriptions/subscriptions.service';
import { SubscriptionRepository } from '../repository/subscription.repository';
import { NotificationService } from './notification.service';
import * as moment from 'moment';
import { activityWeekDaysToDate } from '../controllers/activities/activities.service';
import { TelegramService } from './telegram.service';
import { SettingsService } from '../controllers/settings/settings.service';
import { UserSettingsRepository } from '../repository/userSettings.repository';

@Injectable()
export class ScheduleService {
  subscriptionService:SubscriptionsService;
  notificationService:NotificationService;
  userSettingsService:SettingsService;
  constructor(@Inject('DATABASE_CONNECTION') protected db: Db, protected telegramService: TelegramService){
    this.subscriptionService = new SubscriptionsService(new SubscriptionRepository(this.db));
    this.notificationService = new NotificationService();
    this.userSettingsService = new SettingsService(new UserSettingsRepository(this.db));
    //moment().locale('pt-BR');
    //moment.tz.add('America/Sao_Paulo|LMT -03 -02|36.s 30 20|01212121212121212121212121212121212121212121212121212121212121212121212121212121212121212121|-2glwR.w HdKR.w 1cc0 1e10 1bX0 Ezd0 So0 1vA0 Mn0 1BB0 ML0 1BB0 zX0 pTd0 PX0 2ep0 nz0 1C10 zX0 1C10 LX0 1C10 Mn0 H210 Rb0 1tB0 IL0 1Fd0 FX0 1EN0 FX0 1HB0 Lz0 1EN0 Lz0 1C10 IL0 1HB0 Db0 1HB0 On0 1zd0 On0 1zd0 Lz0 1zd0 Rb0 1wN0 Wn0 1tB0 Rb0 1tB0 WL0 1tB0 Rb0 1zd0 On0 1HB0 FX0 1C10 Lz0 1Ip0 HX0 1zd0 On0 1HB0 IL0 1wp0 On0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 Rb0 1zd0 Lz0 1C10 Lz0 1C10 On0 1zd0 On0 1zd0 On0 1zd0 On0 1HB0 FX0|20e6');
    this.sendActivityNotification = this.sendActivityNotification.bind(this);
    this.scheduleRecurrentActivityNotification = this.scheduleRecurrentActivityNotification.bind(this);
  }

  async scheduleActivityNotification(activity:IActivity) {
    if(!activity.enabled) return;

    const userSettings = await this.userSettingsService.findByUserId(activity.userId) as unknown as IUserSettings;
    if(userSettings.disableNotifications) return;

    const dayOfWeek = activityWeekDaysToDate(activity.weekdays)

    const brazil = moment(activity.time);
    const hour = brazil.hours();
    const minute = brazil.minutes();

    const scheduleId = activity._id.toString();

    //If already scheduled, stop
    const my_job = schedule?.scheduledJobs[scheduleId];
    my_job?.cancel();

    //if is a reminder, schedule reminder for reminder offset
    if(!(activity as any).isReminder && activity.remindUser && !activity.repeatable){
      (activity as any).isReminder = true;
      activity.repeatable = false;
      activity.time = moment(activity.time).subtract(activity.remindOffset, activity.remindOffsetType === RemindOffsetType.hours ? 'hours': 'minutes').toDate();
      await this.scheduleActivityNotification(activity);
    }

    //if is repeatable, schedule repetition on start date
    if(activity.repeatable){
      await this.scheduleRecurrentActivityNotification(activity);
      return;
    }

    console.log("scheduling:", scheduleId, { hour, minute, dayOfWeek });

    schedule.scheduleJob(scheduleId, { hour, minute, dayOfWeek }, this.sendActivityNotification.bind(this, activity));
  }

  async scheduleRecurrentActivityNotification(...args){
    const activity:IActivity = args[0];

    console.log('scheduling recurrent activity:', activity)

    //schedule start of repetition if is set
    if(activity.repeatIntervalStartDate){
      const startDate = activity.repeatIntervalStartDate;
      activity.repeatIntervalStartDate = null;

      console.log('scheduling job for:', new Date(startDate))

      schedule.scheduleJob(activity._id, new Date(startDate), this.scheduleRecurrentActivityNotification.bind(this, activity));
      return;
    }

    const rule = new schedule.RecurrenceRule();

    if(activity.repeatIntervalType === RepeatIntervalType.hours)
      rule.hour = new schedule.Range(0, 23, activity.repeatInterval);
    else
      rule.minute = new schedule.Range(0, 59, activity.repeatInterval);

    rule.tz = 'America/Sao_Paulo';

    console.log('recurrence rule:', rule)

    console.log('next job invocation date:', rule.nextInvocationDate(new Date()))

    //start repetition
    schedule.scheduleJob(activity._id, rule, this.sendActivityNotification.bind(this, activity));
  }

  async sendActivityNotification(...args){
    console.log({sendActivityNotification:args})
    const activity:IActivity = args[0];

    const userSettings = await this.userSettingsService.findByUserId(activity.userId) as unknown as IUserSettings;
    if(userSettings.disableNotifications) return;

    const subscriptions = await this.subscriptionService.getUserSubscription(activity.userId);
    for (const sb of subscriptions) {
      if (sb.token)
      await this.notificationService.sendActivityNotificationFCM(sb, activity)
      else
      await this.notificationService.sendActivityNotificationWebpush(sb.subscription, activity);
    }
    await this.telegramService.sendActivityNotification(activity);
  }

  cancelActivitySchedule(id:string){
    const my_job = schedule?.scheduledJobs[id];
    my_job?.cancel();
  }
}
