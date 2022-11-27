import { SubscriptionService } from "./subscription.service";
import * as schedule from 'node-schedule'
import { IActivity } from "@uncool/shared";

export class ScheduleService {
  constructor(protected subscriptionService:SubscriptionService){
  }

  async scheduleActivityNotification(activity:IActivity) {
    const subscriptions = await this.subscriptionService.getUserSubscription(activity.userId);

    const dayOfWeek = new Date().getDay()
    const hour = new Date(activity.time).getHours();
    const minute = new Date(activity.time).getMinutes();

    const scheduleId = activity._id.toString();

    //If already scheduled, stop
    const my_job = schedule?.scheduledJobs[scheduleId];
    my_job?.cancel();

    console.log("scheduling:", scheduleId, { hour, minute, dayOfWeek })

    schedule.scheduleJob(scheduleId, { hour, minute, dayOfWeek }, async () => {
      for (const sb of subscriptions) {
        if (sb.token)
          await this.subscriptionService.sendFCMNotification(sb, activity)
        else
          await this.subscriptionService.sendActivityNotification(sb.subscription, activity);
      }
    });
  }

  cancelActivitySchedule(id:string){
    const my_job = schedule?.scheduledJobs[id];
    my_job?.cancel();
  }
}
