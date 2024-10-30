import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [TicketController],
  providers: [TicketService, PrismaClient],
})
export class TicketModule {}
