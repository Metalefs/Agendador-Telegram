import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ActivityRepository } from '../../repository/activity.repository';
import { ScheduleService } from '../../services/schedule.service';
import { IActivity } from '@uncool/shared';
import * as moment from 'moment';

@Injectable()
export class ActivitiesService {
  constructor(protected repo: ActivityRepository, protected scheduleService: ScheduleService) {

  }

  async list(req) {
    const list = await this.repo.find({ userId: new ObjectId(req.user) });
    return list.sort((a, b) => (a.priority || 0) - (b.priority || 0));
  }

  async findOne(id, userId) {
    return this.repo.findOne({ _id: new ObjectId(id), userId: new ObjectId(userId) })
  }

  async findByTpe(type, userId) {
    return this.repo.find({ type, userId: new ObjectId(userId) })
  }

  async insert(activity: IActivity) {
    const result = await this.repo.insert(activity);
    const inserted = await this.findOne(result.insertedId, activity.userId) as any;
    await this.scheduleService.scheduleActivityNotification(inserted);
  }

  async update(id, activity: IActivity, userId) {
    const { _id, ...postWithoutId } = activity;
    if (!postWithoutId) return;
    activity.userId = new ObjectId(userId) as any;
    postWithoutId.userId = new ObjectId(userId) as any;
    await this.scheduleService.scheduleActivityNotification(activity);
    return this.repo.update({ _id: new ObjectId(id) }, postWithoutId);
  }

  async delete(id) {
    //If already scheduled, stop
    this.scheduleService.cancelActivitySchedule(id);
    return this.repo.removeByFilter({ _id: new ObjectId(id) });
  }

  async getPendingActivities() {
    const today = dateToActivityWeekDay(new Date().getDay()).toString();
    const dueToday = await this.repo.find({ weekdays: today });

    return dueToday.filter(notification => {
      const notifDate = new Date(notification.time);
      const compareDate = new Date();
      compareDate.setHours(notifDate.getHours());
      compareDate.setMinutes(notifDate.getMinutes());
      compareDate.setSeconds(notifDate.getSeconds());

      return moment(compareDate).isSameOrAfter()
    })
  }
}


const weekdays =[
  "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
];
export function dateToActivityWeekDay(day) {
  return weekdays[day]
}
export function activityWeekDaysToDate(days) {
  const dates = []
  days.forEach((day,idx) => {
    dates[idx] = weekdays.indexOf(day);
  })
  return dates
}
