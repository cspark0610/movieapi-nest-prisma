import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ResultTemplate } from "./entities/result-template.entity.dto";
import { SaleResult } from "./entities/sale-result.entity";

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async updateMovieStockAndCreateSaleRecord(body): Promise<ResultTemplate | SaleResult> {
    const { movieId, customerEmail } = body;
    const movie = await this.prisma.movie.findFirst({
      where: {
        id: movieId,
      },
    });
    if (movie.stock > 0) {
      const newStock = movie.stock - 1;
      const newSaleRecord = { customerEmail, price: movie.salePrice };
      const newSale = await this.prisma.sale.create({
        data: {
          ...newSaleRecord,
          movieId: { connect: { id: movieId } },
        },
      });

      const updateResult = await this.prisma.movie.updateMany({
        where: { id: movie.id },
        data: { stock: newStock < 0 ? 0 : newStock },
      });
      if (newSale && updateResult.count)
        return {
          movieId: movie.id,
          customerEmail,
          price: movie.salePrice,
        };
    } else {
      // in case stock is 0 update movie availaible to false
      await this.prisma.movie.updateMany({
        where: { id: movie.id },
        data: { available: false },
      });

      return { success: false, statusCode: 400, message: "bad request movie is not available to sell" };
    }
  }
}

