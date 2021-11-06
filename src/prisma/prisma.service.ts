import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  logger: Logger = new Logger(PrismaService.name);
  constructor() {
    super({ log: ['query', 'error', 'warn'] });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Successfully made a prisma connection');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Successfully disconnected the prisma connection');
  }
}
