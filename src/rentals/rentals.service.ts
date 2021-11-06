import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResultTemplate } from 'src/sales/entities/result-template.entity.dto';
import { RentalDto } from 'src/rentals/dto/rental.dto';
import { RentalResult } from './entities/rental-result.entity';

@Injectable()
export class RentalsService {
  constructor(private readonly prisma: PrismaService) {}

  async updateMovieStockAndCreateRentalRecord(body): Promise<RentalResult | Object> {
    const { movieId, customerEmail } = body;
    const movie = await this.prisma.movie.findUnique({
      where: {
        id: movieId
      }
    });
    if (movie.available) {
      const newStock = movie.stock - 1;
      const newRentalRecord = { customerEmail, price: movie.salePrice };
      const newRental = await this.prisma.rental.create({
        data: {
          ...newRentalRecord,
          movieId: { connect: { id: movieId } }
        }
      });

      const updateResult = await this.prisma.movie.updateMany({
        where: { id: movie.id },
        data: { stock: newStock < 0 ? 0 : newStock }
      });
      if (newRental && updateResult.count)
        return {
          movieId: movie.id,
          customerEmail,
          price: movie.salePrice
        };
    }
    return { success: false, statusCode: 400, message: 'bad request movie is not available to rent' };
  }
}
