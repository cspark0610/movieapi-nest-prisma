import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private likeService: LikesService) {}

  @Post()
  @UseFilters(HttpExceptionFilter)
  createLikeRecord(@Body() body) {
    return this.likeService.createLikeRecord(body);
  }
}
