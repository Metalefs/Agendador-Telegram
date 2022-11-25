import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ActivityRepository } from '../../repository/activity.repository';

@Injectable()
export class ActivitiesService {
  constructor(protected repo: ActivityRepository) {

  }

  async getAll(req){
    const list = await this.repo.find({ userId: new ObjectId(req.user) });
    return list.sort((a, b) => (a.priority || 0) - (b.priority|| 0));
  }

  async getOne(id, userId){
    return this.repo.findOne({ _id: new ObjectId(id), userId: new ObjectId(userId) })
  }

  async add(activity){
    return this.repo.insert(activity);
  }

  async update (id, post, userId){
    const { _id, ...postWithoutId } = post;
    if (postWithoutId) {
      postWithoutId.userId = new ObjectId(userId);
      return this.repo.update({ _id: new ObjectId(id) }, postWithoutId);
    }
  }

  async delete(id){
    return this.repo.removeByFilter({ _id: new ObjectId(id) });
  }
}
