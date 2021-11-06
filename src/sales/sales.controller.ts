import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { SaleDto } from './dto/sale.dto';
import { SalesService } from './sales.service';

@Controller('sales')
@UseFilters(HttpExceptionFilter)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}
  @Post()
  updateMovieStockAndCreateSaleRecord(@Body() body: SaleDto) {
    return this.salesService.updateMovieStockAndCreateSaleRecord(body);
  }
}
