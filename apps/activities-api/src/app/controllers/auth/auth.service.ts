import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { UserService } from '../../services/user.service';

@Injectable()
export class AuthService{
  userService:UserService;
  constructor(@Inject('DATABASE_CONNECTION') protected db: Db) {
    this.userService = new UserService(db);
  }

  register(user) {
    return this.userService.create(user);
  }
  login(user) {
    return this.userService.authenticate(user);
  }
}
