import { Controller, Delete, Get, Param, Put, Post, Req, UseInterceptors } from '@nestjs/common';
import { IChronogram } from '@uncool/shared';
import { ObjectId } from 'mongodb';
import { AuthInterceptor } from '../../middlewares/auth.interceptor';

import { ChronogramsService } from './chronograms.service';

@Controller('chronograms')
@UseInterceptors(AuthInterceptor)
export class ChronogramsController {
  constructor(private readonly chronogramsService: ChronogramsService) { }

  @Get('/')
  async list(@Req() req) {
    return this.chronogramsService.list(req)
  }
  @Get('/type/:type')
  findByType(@Param() params, @Req() req) {
    return this.chronogramsService.findByType(params.type, req.user);
  }

  @Get(':id')
  findById(@Param() params, @Req() req) {
    return this.chronogramsService.findOne(params.id, req.user);
  }

  @Post()
  create(@Req() post) {
    post.body.userId = new ObjectId(post.user);
    return this.chronogramsService.insert(<IChronogram>post.body)
  }

  @Put(':id')
  update(@Param('id') id: string, @Req() request: Request) {
    return this.chronogramsService.update(id, request.body as unknown as IChronogram, (request as any).user);
  }

  @Delete(':id')
  delete(@Param('id') id) {
    return this.chronogramsService.delete(id);
  }
}
