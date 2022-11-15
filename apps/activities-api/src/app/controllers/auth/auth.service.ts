import { Injectable } from '@nestjs/common';
import { UserService } from '../../services/user.service';

@Injectable()
export class AuthService{
  constructor(private userService: UserService) {
  }

  register(user) {
    return this.userService.create(user);
  }
  login(user) {
    return this.userService.authenticate(user);
  }
}
