import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ActivityRepository } from '../../repository/activity.repository';
import * as schedule from 'node-schedule'
import { ScheduleService } from '../../services/schedule.service';
import { IActivity } from '@uncool/shared';

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

  async insert(activity:IActivity) {
    await this.scheduleService.scheduleActivityNotification(activity);
    return this.repo.insert(activity);
  }

  async update(id, activity:IActivity, userId) {
    const { _id, ...postWithoutId } = activity;
    if (!postWithoutId) return;
    postWithoutId.userId = new ObjectId(userId) as any;
    await this.scheduleService.scheduleActivityNotification(activity);
    return this.repo.update({ _id: new ObjectId(id) }, postWithoutId);
  }

  async delete(id) {
    //If already scheduled, stop
    this.scheduleService.cancelActivitySchedule(id);
    return this.repo.removeByFilter({ _id: new ObjectId(id) });
  }
}
