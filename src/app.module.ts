import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { PrismaModule } from './prisma/prisma.module';
import { SalesModule } from './sales/sales.module';
import { RentalsModule } from './rentals/rentals.module';
import { LikesModule } from './likes/likes.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [MoviesModule, PrismaModule, SalesModule, RentalsModule, LikesModule, TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
