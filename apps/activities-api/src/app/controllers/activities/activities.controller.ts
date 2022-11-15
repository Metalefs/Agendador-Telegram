import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { IActivity } from '@uncool/shared';

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
  @Patch(':id')
  update(@Param('id') id: string, @Body() post: IActivity)
  {
    console.log(post);
    return this.activitiesService.update({_id:id}, post);
  }
  @Delete(':id')
  delete(@Param() params)
  {
    console.log(params);
    return this.activitiesService.findById(params.id);
  }
}
