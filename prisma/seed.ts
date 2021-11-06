import { PrismaClient } from '@prisma/client';
import { movies } from '../movies';

const prisma = new PrismaClient();

async function main() {
  for (const movie of movies) {
    await prisma.movie.create({
      data: movie,
    });
  }
}
main()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
