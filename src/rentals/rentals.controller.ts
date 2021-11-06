import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { RentalDto } from './dto/rental.dto';
import { RentalsService } from './rentals.service';

@Controller('rentals')
@UseFilters(HttpExceptionFilter)
export class RentalsController {
  constructor(private readonly salesService: RentalsService) {}
  @Post()
  updateMovieStockAndCreateSaleRecord(@Body() body: RentalDto) {
    return this.salesService.updateMovieStockAndCreateRentalRecord(body);
  }
}
