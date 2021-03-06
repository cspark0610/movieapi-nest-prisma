import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseFilters } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

@Controller('movies')
@UseFilters(HttpExceptionFilter)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Patch(':movieId')
  update(@Param('movieId') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(parseInt(id, 10), updateMovieDto);
  }

  @Put(':movieId')
  updateOne(@Param('movieId') id: string, @Body() updateMovieDto: CreateMovieDto) {
    return this.moviesService.updateOne(parseInt(id, 10), updateMovieDto);
  }

  @Delete(':movieId')
  remove(@Param('movieId') id: string) {
    return this.moviesService.remove(parseInt(id, 10));
  }

  @Get()
  findBySizePageSortAndUnavailable(@Query() query) {
    return this.moviesService.findBySizePageSortAndUnavailable(query);
  }

  @Get('/:unavailable')
  findAllAvailable(@Param('unavailable') { unavailable }) {
    return this.moviesService.findAllAvailable(unavailable);
  }
   // get by title parameter,
  @Get("/title/:titleName")
  findByTitle(@Param("titleName") titleName: string) {
    return this.moviesService.findByTitle(titleName);
  }
}
