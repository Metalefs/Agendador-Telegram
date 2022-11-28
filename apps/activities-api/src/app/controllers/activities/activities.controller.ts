import { Controller, Delete, Get, Param, Put, Post, Req, UseInterceptors } from '@nestjs/common';
import { IActivity } from '@uncool/shared';
import { ObjectId } from 'mongodb';
import { AuthInterceptor } from '../../middlewares/auth.interceptor';

import { ActivitiesService } from './activities.service';

@Controller('activities')
@UseInterceptors(AuthInterceptor)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) { }

  @Get('/')
  async list(@Req() req) {
    return this.activitiesService.list(req)
  }
  @Get('/type/:type')
  findByType(@Param() params, @Req() req) {
    return this.activitiesService.findByTpe(params.type, req.user);
  }

  @Get(':id')
  findById(@Param() params, @Req() req) {
    return this.activitiesService.findOne(params.id, req.user);
  }

  @Post()
  create(@Req() post) {
    post.body.userId = new ObjectId(post.user);
    return this.activitiesService.insert(<IActivity>post.body)
  }

  @Put(':id')
  update(@Param('id') id: string, @Req() request: Request) {
    return this.activitiesService.update(id, <IActivity>request.body, (request as any).user);
  }

  @Delete(':id')
  delete(@Param('id') id) {
    return this.activitiesService.delete(id);
  }
}
