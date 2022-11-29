import { Controller, Delete, Get, Param, Put, Post, Req, UseInterceptors } from '@nestjs/common';
import { IUserSettings } from '@uncool/shared';
import { ObjectId } from 'mongodb';
import { AuthInterceptor } from '../../middlewares/auth.interceptor';

import { SettingsService } from './settings.service';

@Controller('settings')
@UseInterceptors(AuthInterceptor)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Get('/')
  async list(@Req() req) {
    return this.settingsService.list(req)
  }

  @Get(':id')
  findById(@Param() params, @Req() req) {
    return this.settingsService.findByUserId(req.user);
  }

  @Post()
  create(@Req() post) {
    post.body.userId = new ObjectId(post.user);
    return this.settingsService.insert(<IUserSettings>post.body)
  }

  @Put(':id')
  update(@Param('id') id: string, @Req() request: Request) {
    return this.settingsService.update(id, <IUserSettings>(request.body as any), (request as any).user);
  }

  @Delete(':id')
  delete(@Param('id') id) {
    return this.settingsService.delete(id);
  }
}
