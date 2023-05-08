require('dotenv').config()
import { Db } from 'mongodb';
import { BaseRepository } from './base.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ChronogramRepository extends BaseRepository {

  constructor(@Inject('DATABASE_CONNECTION') protected db: Db) {
    super(db, 'chronograms')
  }

};
