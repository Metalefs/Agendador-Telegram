require('dotenv').config()
import { Db } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { ActivityRepository } from '../repository/activity.repository';
import * as moment from 'moment';

@Injectable()
export class ActivityService {

  repo: ActivityRepository;
  constructor(protected db: Db) {
    this.repo = new ActivityRepository(db)
  }

  async getPendingNotifications() {
    const today = parseActivityDay(new Date().getDay()).toString();
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


};

export function parseActivityDay(day) {
  return [
    "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
  ][day]
}
