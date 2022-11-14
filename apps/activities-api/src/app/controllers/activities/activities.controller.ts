import { Controller, Get, Req } from '@nestjs/common';

import { ActivitiesService } from './activities.service';

@Controller()
export class ActivitiesController {
  constructor(private readonly appService: ActivitiesService) {}

  @Get()
  getActivities(@Req() req) {
    console.log(req);
    return this.appService.getActivities('');
  }
  @Get('/:id')
  getActivity() {
    return this.appService.getActivities('');
  }
}
