import { Db } from "mongodb";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository{
  constructor(protected db: Db){
    super(db, 'user')
  }
}
