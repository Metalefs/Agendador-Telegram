import { Inject } from "@nestjs/common";
import { Db } from "mongodb";
import { BaseRepository } from "./base.repository";

export class UserSettingsRepository extends BaseRepository{
  constructor(@Inject('DATABASE_CONNECTION') protected db: Db){
    super(db, 'user_settings')
  }
}
