import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikeResultEntity } from './entities/like-result.entity';

@Injectable()
export class LikesService {
  constructor(private readonly prisma: PrismaService) {}

  async createLikeRecord(body): Promise<LikeResultEntity | Object> {
    //create like record and connect to model movie
    const { movieId, customerEmail } = body;
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId }
    });
    if (movie.available) {
      const arrayOfCustomersEmails = [];
      arrayOfCustomersEmails.push(customerEmail);
      const newLike = {
        movieId,
        likes: arrayOfCustomersEmails.length,
        customers: JSON.stringify(arrayOfCustomersEmails)
      };
      const newLikeRecord = await this.prisma.like.create({
        data: {
          ...newLike,
          movieId: { connect: { id: movieId } }
        }
      });
      return {
        movieId,
        likes: newLikeRecord.likes,
        customers: JSON.parse(newLikeRecord.customers)
      };
    }
    return { success: false, statusCode: 400, message: 'bad request movie is not available to like' };
  }
}
