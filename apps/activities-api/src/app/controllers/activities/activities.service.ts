import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { BaseService } from '../../services/base.service';

@Injectable()
export class ActivitiesService extends BaseService {
  constructor(@Inject('DATABASE_CONNECTION') protected db: Db) {
    super(db, "activities");
  }
}
