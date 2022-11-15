import { Body, Controller, Get, Post, Req } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() body) {
    return this.authService.register(body);
  }
  @Post('/login')
  login(@Body() body) {
    console.log(body);
    return this.authService.login(body);
  }
}
