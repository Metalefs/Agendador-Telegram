import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { IUserSettings } from '@uncool/shared';
import { UserSettingsRepository } from '../../repository/userSettings.repository';

@Injectable()
export class SettingsService {
  constructor(protected repo: UserSettingsRepository) {

  }

  async list(req) {
    const list = await this.repo.find({ userId: new ObjectId(req.user) });
    return list.sort((a, b) => (a.priority || 0) - (b.priority || 0));
  }

  async findByUserId(userId) {
    return this.repo.findOne({ userId: new ObjectId(userId) })
  }

  async insert(settings: IUserSettings) {
    return await this.repo.insert(settings);
  }

  async update(id, settings: IUserSettings, userId) {
    const { _id, ...postWithoutId } = settings;
    if (!postWithoutId) return;
    postWithoutId.userId = new ObjectId(userId) as any;
    return this.repo.update({ _id: new ObjectId(id) }, postWithoutId);
  }

  async delete(id) {
    return this.repo.removeByFilter({ _id: new ObjectId(id) });
  }
}
