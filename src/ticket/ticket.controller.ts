import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateTicketDto } from './ticket-dto/ticket-create-dto';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get('get-all-tickets')
  async getAllTickets() {
    return await this.ticketService.getAllTickets();
  }

  @Post('create-ticket')
  async createTicket(@Body() createTicketDto: CreateTicketDto) {
    return await this.ticketService.createTicket(createTicketDto);
  }

  @Get('get-ticket-by-id/:ticket_id')
  async getTicketById(@Param('ticket_id') ticket_id: number) {
    return await this.ticketService.getTicketById(ticket_id);
  }

  @Get('get-ticket-by-user-id/:user_id')
  async getTicketByUserId(@Param('user_id') user_id: number) {
    return await this.ticketService.getTicketByUserId(user_id);
  }
}
