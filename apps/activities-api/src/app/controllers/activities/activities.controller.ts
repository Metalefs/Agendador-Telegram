import { Body, Controller, Delete, Get, Param, Put, Post, Req } from '@nestjs/common';
import { IActivity } from '@uncool/shared';
import { ObjectId } from 'mongodb';

import { ActivitiesService } from './activities.service';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get('/')
  list(@Req() req) {
    return this.activitiesService.list();
  }
  @Get(':id')
  findById(@Param() params)
  {
    console.log(params);
    return this.activitiesService.findById(params.id);
  }
  @Post()
  create(@Body() post: IActivity)
  {
    return this.activitiesService.insert(post);
  }
  @Put(':id')
  update(@Param('id') id: string, @Body() post: IActivity)
  {
    console.log(id,post);
    const { _id, ...postWithoutId } = post;

    return this.activitiesService.update({_id: new ObjectId(id)}, postWithoutId);
  }
  @Delete(':id')
  delete(@Param() params)
  {
    console.log(params);
    return this.activitiesService.removeByFilter({_id:new ObjectId(params.id)});
  }
}
