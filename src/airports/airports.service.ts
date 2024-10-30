import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AirportsService {
  constructor(private prisma: PrismaClient) {}

  async getAllAirports() {
    try {
      const data = await this.prisma.airports.findMany();

      return {
        data,
        message: 'Get all airports successfully',
        status: HttpStatus.OK,
        date: new Date(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'An error occurred while getting all airports',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAirportById(id) {
    try {
      const airport_id = parseInt(id);
      const data = await this.prisma.airports.findFirst({
        where: { airport_id: airport_id },
      });

      if (!data) {
        throw new HttpException('Airport not found', HttpStatus.NOT_FOUND);
      }

      return {
        data,
        message: 'Get airport by id successfully',
        status: HttpStatus.OK,
        date: new Date(),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'An error occurred while getting airport by id',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAirportByName(name) {
    try {
      const airport = await this.prisma.airports.findMany({
        where: {
          airport_name: {
            contains: name,
          },
        },
      });
      return {
        data: airport,
        message: 'Get airport by name successfully',
        status: HttpStatus.OK,
        date: new Date(),
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'An error occurred while getting airport by id',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
