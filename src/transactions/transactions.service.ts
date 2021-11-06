import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMovieTransactions(movieId: number, req) {
    let { from, to } = req.query;
    from = new Date(from);
    to = new Date(to);

    const rentalsDatesArray = [];
    const salesDatesArray = [];
    const customersArray = [];
    // findMany based in movieId in model Rental and Sales createdAt field and customers and push them in rentalsDatesArray salesDatesArray and customersArray
    const rentals = await this.prisma.rental.findMany({
      where: { id: movieId },
      select: {
        createdAt: true,
        customerEmail: true
      }
    });
    const sales = await this.prisma.sale.findMany({
      where: { id: movieId },
      select: {
        createdAt: true,
        customerEmail: true
      }
    });

    const rentalsResult = rentals.map(rental => {
      if (rental.createdAt >= from && rental.createdAt <= to) {
        rentalsDatesArray.push(rental.createdAt);
        customersArray.push(rental.customerEmail);
      }
    });
    const salesResult = sales.map(sale => {
      if (sale.createdAt >= from && sale.createdAt <= to) {
        salesDatesArray.push(sale.createdAt);
        customersArray.push(sale.customerEmail);
      }
    });
    if (rentalsResult.length || salesResult.length) {
      return {
        movieId,
        rentals: rentalsDatesArray,
        sales: salesDatesArray,
        totalRevenue: rentalsDatesArray.length + salesDatesArray.length,
        customers: customersArray
      };
    }
    return {
      statusCode: 404,
      message: 'No transactions found'
    };
  }
}
