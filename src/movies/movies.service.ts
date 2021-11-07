import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMovieDto } from "./dto/create-movie.dto";
import { UpdateMovieDto } from "./dto/update-movie.dto";
import { Movie } from "./entities/movie.entity";
import { ResultTemplateEntity } from "./entities/result-template.entity";

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProductDto: CreateMovieDto): Promise<Partial<Movie>> {
    return this.prisma.movie.create({
      data: createProductDto,
    });
  }

  findOneById(id: number): Promise<any> {
    return this.prisma.movie.findMany({
      where: { id: id },
    });
  }

  private findOneAvailable(id: number) {
    return this.prisma.movie.findUnique({
      where: { id: id },
      select: {
        available: true,
      },
    });
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Partial<Movie>> {
    const found = await this.findOneAvailable(id);
    Logger.log(found);
    if (found.available) {
      return this.prisma.movie.update({
        where: { id: id },
        data: updateMovieDto,
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
        data: updateMovieDto,
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
      where: { id: id },
    });
    return !!deleted;
  }

  //debo pasar los values de las 4 variables en este caso o no
  async findBySizePageSortAndUnavailable(query): Promise<ResultTemplateEntity> {
    const r = {};
    for (const queryKey of Object.keys(query)) {
      r[queryKey] = query[queryKey];
    }
    let size = r["size"] ? Number(r["size"]) : null;
    let page = r["page"] ? Number(r["page"]) : null;
    let key = r["sort"] ? r["sort"].split(",")[0] : null;
    let order = r["sort"] ? r["sort"].split(",")[1] : null;
    let title = r["title"] ? r["title"].toLowerCase() : null;
    const totalMovies = await this.prisma.movie.count();
    //`unavailable=true` returns all the movies.
    if (r["unavailable"] === "true" && r["size"] instanceof Number && r["page"] instanceof Number && r["sort"]) {
      const movies = await this.prisma.movie.findMany({
        skip: (page - 1) * size,
        take: size,
        orderBy: {
          [key]: order,
        },
      });
      return {
        content: movies,
        size: size,
        numberOfElements: movies.length,
        totalElements: totalMovies,
        totalPages: page,
        number: (page - 1) * size,
      };
    } else if (r["unavailable"] === "false" && r["size"] instanceof Number && r["page"] instanceof Number && r["sort"]) {
      //same with unavailable='false', only returns the available movies.
      const movies = await this.prisma.movie.findMany({
        skip: (page - 1) * size,
        take: size,
        where: { available: true },
        orderBy: {
          [key]: order,
        },
      });
      return {
        content: movies,
        size: size,
        numberOfElements: movies.length,
        totalElements: totalMovies,
        totalPages: page,
        number: (page - 1) * size,
      };
    } else if (r["size"] instanceof Number && r["page"] instanceof Number) {
      //same with unavailable='false', only returns the available movies.
      const movies = await this.prisma.movie.findMany({
        skip: (page - 1) * size,
        take: size,
      });
      return {
        content: movies,
        size: size,
        numberOfElements: movies.length,
        totalElements: totalMovies,
        totalPages: page,
        number: (page - 1) * size,
      };
    } else if (key && order) {
      const movies = await this.prisma.movie.findMany({
        take: 12,
        orderBy: {
          [key]: order,
        },
      });
      return {
        content: movies,
        size: 12,
        numberOfElements: movies.length,
        totalElements: totalMovies,
        totalPages: 1,
        number: 0,
      };
    } else if (r["size"] instanceof Number && r["unavailable"] === "true") {
      const movies = await this.prisma.movie.findMany({
        take: size,
      });
      return {
        content: movies,
        size: size,
        numberOfElements: movies.length,
        totalElements: totalMovies,
        totalPages: page,
        number: 0,
      };
    } else if (title) {
      const movies = await this.prisma.movie.findMany({
        where: {
          title: {
            contains: title,
          },
        },
      });
      return {
        content: movies,
        size: 0,
        numberOfElements: movies.length,
        totalElements: totalMovies,
        totalPages: 0,
        number: 0,
      };
    } else {
      const movies = await this.prisma.movie.findMany({ take: 12 });
      return {
        content: movies,
        size: 12,
        numberOfElements: movies.length,
        totalElements: totalMovies,
        totalPages: 1,
        number: 0,
      };
    }
  }

  findAllAvailable(unavailable): Promise<any> {
    if (unavailable === "true") {
      return this.prisma.movie.findMany({});
    } else {
      return this.prisma.movie.findMany({
        where: { available: true },
      });
    }
  }
  /**
   * 
   * @param titleName 
   * @returns 
   * 
- Should filter the movies by a `title` parameters. Where parameter is
  case-insensitive and could be just a peace of the movie’s title .
   */
  async findByTitle(titleName: string): Promise<any> {
    //find all the movies where movie title parameter contains titleName

    return this.prisma.movie.findMany({
      where: {
        title: {
          contains: titleName,
        },
      },
    });
  }
}

/*

- Should response a collection of movies. By default, only available
  movies should be response, unless `unavailable` parameter indicates
  otherwise. `unavailable=true` returns all the movies.

- Should response a movie’s page by paginating with `size` and `page`
  parameters, and sorting with `sort` parameters (sort parameter
  syntax `sort=<field[,asc|,desc]>`). By default, each page must have
  at most 12 elements and start at the first page and sorted by a
  title ascendant. `page=1`, `size=20`, `sort=description,asc`

- Should filter the movies by a `title` parameters. Where parameter is
  case-insensitive and could be just a peace of the movie’s title .

- Should return an object containing the `content` property, that
  contains the array of Movies that have been found

- Should return an object with the following properties:

  - `size`: the size of the page requested

  - `numberOfElements`: the number of elements that are found in the
    current page

  - `totalElements`: the number of elements found with the given
    criteria

  - `totalPages`: the number of pages available

  - `number`: the current page number

*/
