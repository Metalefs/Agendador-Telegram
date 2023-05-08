import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ChronogramRepository } from '../../repository/chronogram.repository';
import { IChronogram } from '@uncool/shared';

@Injectable()
export class ChronogramsService {
  constructor(protected repo: ChronogramRepository) {

  }

  async list(req) {
    const list = await this.repo.find({ userId: new ObjectId(req.user) });
    return list.sort((a, b) => (a.priority || 0) - (b.priority || 0));
  }

  async findOne(id, userId) {
    return this.repo.findOne({ _id: new ObjectId(id), userId: new ObjectId(userId) })
  }

  async findByType(type, userId) {
    return this.repo.find({ type, userId: new ObjectId(userId) })
  }

  async findByUserId(userId) {
    return this.repo.find({ userId: new ObjectId(userId) })
  }

  async insert(chronogram: IChronogram) {
    const result = await this.repo.insert(chronogram);
    const inserted = await this.findOne(result.insertedId, chronogram.userId) as any;
  }

  async update(id, chronogram: IChronogram, userId) {
    const { _id, ...postWithoutId } = chronogram;
    return this.repo.update({ _id: new ObjectId(id) }, postWithoutId);
  }

  async delete(id) {
    return this.repo.removeByFilter({ _id: new ObjectId(id) });
  }

  async getAll() {
    const results = await this.repo.find({});
    return results
  }
}
