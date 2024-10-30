import { Module } from '@nestjs/common';
import { AirportsService } from './airports.service';
import { AirportsController } from './airports.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [AirportsController],
  providers: [AirportsService, PrismaClient],
})
export class AirportsModule {}
