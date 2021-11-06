import { Controller, Get, Param, Request, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { TransactionsService } from './transactions.service';

@Controller('transactions/movies')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get('/:movieId')
  @UseFilters(HttpExceptionFilter)
  async getMovieTransactions(@Param('movieId') movieId: string, @Request() req) {
    return await this.transactionsService.getMovieTransactions(Number(movieId), req);
  }
}
