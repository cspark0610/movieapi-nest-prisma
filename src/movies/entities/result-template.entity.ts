import { Movie } from './movie.entity';

export class ResultTemplateEntity {
  content: Array<Movie>;
  size: number;
  numberOfElements: number;
  totalElements: number;
  totalPages: number;
  //the current page number
  number: number;
}
