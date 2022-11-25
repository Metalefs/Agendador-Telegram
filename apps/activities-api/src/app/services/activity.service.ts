require('dotenv').config()
import { Db } from 'mongodb';
import { Inject, Injectable } from '@nestjs/common';
import { ActivityRepository } from '../repository/activity.repository';
import * as moment from 'moment';

@Injectable()
export class ActivityService {

  repo:ActivityRepository;
  constructor(@Inject('DATABASE_CONNECTION') protected db: Db) {
    this.repo = new ActivityRepository(db)
  }

  async getPendingNotifications(){
    const dueToday = await this.repo.find({
      'weekdays': {
          $in: [
            this.parseActivityDay(new Date().getDay())
          ]
      }
    });


    return dueToday.filter(notification => {
      const notifDate = new Date(notification.time);
      const compareDate = new Date();
      compareDate.setHours(notifDate.getHours());
      compareDate.setMinutes(notifDate.getMinutes());
      compareDate.setSeconds(notifDate.getSeconds());

      return moment(compareDate).isSameOrAfter()
    })
  }

  private parseActivityDay(day){
    return [
      'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
    ][day]
  }

};
