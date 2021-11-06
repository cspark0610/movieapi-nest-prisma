import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProductDto: CreateMovieDto): Promise<Partial<Movie>> {
    return this.prisma.movie.create({
      data: createProductDto
    });
  }

  findOneById(id: number): Promise<any> {
    return this.prisma.movie.findMany({
      where: { id: id }
    });
  }

  private findOneAvailable(id: number) {
    return this.prisma.movie.findUnique({
      where: { id: id },
      select: {
        available: true
      }
    });
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Partial<Movie>> {
    const found = await this.findOneAvailable(id);
    Logger.log(found);
    if (found.available) {
      return this.prisma.movie.update({
        where: { id: id },
        data: updateMovieDto
      });
    } else {
      throw new NotFoundException(`Movie with ${id} not found hence cannot be patched`);
    }
  }
  async updateOne(id: number, updateMovieDto: CreateMovieDto): Promise<Partial<Movie>> {
    const found = await this.findOneAvailable(id);
    if (found.available) {
      return this.prisma.movie.update({
        where: { id: id },
        data: updateMovieDto
      });
    } else {
      throw new NotFoundException(`Movie with ${id} not found hence cannot de updated`);
    }
  }

  async remove(id: number): Promise<boolean> {
    const found = await this.findOneAvailable(id);
    if (!found) {
      throw new NotFoundException(`Movie with ${id} not found hence cannot be deleted`);
    }
    const deleted = this.prisma.movie.delete({
      where: { id: id }
    });
    return !!deleted;
  }

  //debo pasar los values de las 4 variables en este caso
  async findBySizePageSortAndUnavailable(req) {
    let { size, page, sort, unavailable } = req.query;
    size = Number(size);
    page = Number(page);
    const [key, order] = sort.split(',');

    //`unavailable=true` returns all the movies.
    if (unavailable === 'true') {
      const movies = await this.prisma.movie.findMany({
        skip: (page - 1) * size,
        take: size,
        orderBy: {
          [key]: order
        }
      });
      return {
        content: movies,
        size: size,
        numberOfElements: size * page,
        totalElements: size,
        totalPages: page,
        number: (page - 1) * size
      };
    } else {
      const movies = await this.prisma.movie.findMany({
        skip: (page - 1) * size,
        take: size,
        where: { available: true },
        orderBy: {
          [key]: order
        }
      });
      return {
        content: movies,
        size: size,
        numberOfElements: size * page,
        totalElements: size,
        totalPages: page,
        number: (page - 1) * size
      };
    }
  }
  findAllAvailable(unavailable): Promise<any> {
    if (unavailable === 'true') {
      return this.prisma.movie.findMany({});
    } else {
      return this.prisma.movie.findMany({
        where: { available: true }
      });
    }
  }
}
