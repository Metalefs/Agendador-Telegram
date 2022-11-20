import { Controller, Delete, Get, Param, Put, Post, Req, UseInterceptors } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { AuthInterceptor } from '../../middlewares/auth.interceptor';

import { ActivitiesService } from './activities.service';

@Controller('activities')
@UseInterceptors(AuthInterceptor)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) { }

  @Get('/')
  async list(@Req() req) {
    const list = await this.activitiesService.find({ userId: new ObjectId(req.user) });
    return list.sort((a, b) => (a.priority || 0) - (b.priority|| 0));
  }
  @Get(':id')
  findById(@Param() params, @Req() req) {
    return this.activitiesService.findOne({ _id: new ObjectId(params.id), userId: new ObjectId(req.user) });
  }
  @Post()
  create(@Req() post) {
    post.body.userId = new ObjectId(post.user);
    return this.activitiesService.insert(post.body);
  }
  @Put(':id')
  update(@Param('id') id: string, @Req() request: Request) {
    const { _id, ...postWithoutId } = request.body as any;
    if (postWithoutId) {
      postWithoutId.userId = new ObjectId((request as any).user);
      return this.activitiesService.update({ _id: new ObjectId(id) }, postWithoutId);
    }
  }
  @Delete(':id')
  delete(@Param() params) {
    return this.activitiesService.removeByFilter({ _id: new ObjectId(params.id) });
  }
}
