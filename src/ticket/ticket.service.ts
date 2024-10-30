import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateTicketDto } from './ticket-dto/ticket-create-dto';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaClient) {}

  async getAllTickets() {
    return await this.prisma.tickets.findMany();
  }
  generateRandomNumber(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return result;
  }

  async createTicket(createTicketDto: CreateTicketDto) {
    try {
      const { passengers, ...ticketData } = createTicketDto;
      ticketData.ticket_number = `TK${this.generateRandomNumber(4)}`;

      const ticket = await this.prisma.tickets.create({
        data: ticketData,
      });
      let passengerCount = 0;
      if (passengers && passengers.length > 0) {
        passengerCount = passengers.length;
        await this.prisma.passengers.createMany({
          data: passengers.map((passenger) => ({
            ...passenger,
            ticket_id: ticket.ticket_id,
            gender: passenger.gender ? 1 : 0,
            date_of_birth: new Date(passenger.date_of_birth).toISOString(),
            passport_number: passenger.passport_number ?? null,
          })),
        });
      }
      const updatedTicket = await this.prisma.tickets.update({
        where: { ticket_id: ticket.ticket_id },
        data: { passenger: passengerCount },
      });
      return {
        message: 'Ticket created successfully',
        ticket,
        status: HttpStatus.CREATED,
        created_at: new Date(),
      };
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            `A ticket with the number ${createTicketDto.ticket_number} already exists.`,
            HttpStatus.CONFLICT,
          );
        }
      }
      throw new HttpException('Error creating ticket', HttpStatus.BAD_REQUEST);
    }
  }

  async getTicketById(ticket_id: number) {
    try {
      const ticketId = parseInt(ticket_id.toString());
      const ticket = await this.prisma.tickets.findFirst({
        where: { ticket_id: ticketId },
        include: { passengers: true },
      });
      if (!ticket) {
        throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
      }
      return {
        ticket,
        message: 'Get ticket by ID successfully',
        status: HttpStatus.OK,
        created_at: new Date(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'An error occurred while processing your request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTicketByUserId(user_id: number) {
    try {
      const userId = parseInt(user_id.toString());
      const tickets = await this.prisma.tickets.findMany({
        where: { user_id: userId },
        include: {
          passengers: true,
          flights: {
            include: {
              airports_flights_departure_airport_idToairports: true,
              airports_flights_arrival_airport_idToairports: true,
            },
          },
        },
      });
      if (!tickets || tickets.length < 1) {
        throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
      }
      return {
        tickets,
        message: 'Get ticket by user ID successfully',
        status: HttpStatus.OK,
        created_at: new Date(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'An error occurred while processing your request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
