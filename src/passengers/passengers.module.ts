import { Module } from '@nestjs/common';
import { PassengersService } from './passengers.service';
import { PassengersController } from './passengers.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [PassengersController],
  providers: [PassengersService, PrismaClient],
})
export class PassengersModule {}
