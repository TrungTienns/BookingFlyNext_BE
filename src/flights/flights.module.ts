import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { PrismaClient } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/strategy/jwt.strategy';

@Module({
  imports: [JwtModule, AuthModule],
  controllers: [FlightsController],
  providers: [FlightsService, PrismaClient, JwtStrategy],
})
export class FlightsModule {}
