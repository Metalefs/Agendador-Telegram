require('dotenv').config()
import { Db } from 'mongodb';
import { Inject, Injectable } from '@nestjs/common';
import { ActivityRepository } from '../repository/activity.repository';

@Injectable()
export class ActivityService {

  repo:ActivityRepository;
  constructor(@Inject('DATABASE_CONNECTION') protected db: Db) {
    this.repo = new ActivityRepository(db)
  }

  async getPendingNotifications(){
    return this.repo.find({
      'time': {$gta: new Date().toUTCString()},
      'weekdays': {
          $in: [
            this.parseActivityDay(new Date().getDay())
          ]
      }
    })
  }

  private parseActivityDay(day){
    return [
      'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
    ][day]
  }

};
