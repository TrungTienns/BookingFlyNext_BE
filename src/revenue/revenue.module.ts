import { Module } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { RevenueController } from './revenue.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [RevenueController],
  providers: [RevenueService, PrismaClient],
})
export class RevenueModule {}
