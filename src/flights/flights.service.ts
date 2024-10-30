import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FlightsService {
  constructor(private prisma: PrismaClient) {}

  async getFlightsByDepartureArrival(
    departureId: any,
    arrivalId: any,
    departureTime: any,
  ) {
    const departure_Id = parseInt(departureId);
    const arrival_Id = parseInt(arrivalId);
    try {
      const utcDepartureTime = new Date(departureTime).toUTCString();
      const startOfDepartureDate = new Date(utcDepartureTime);
      startOfDepartureDate.setUTCHours(0, 0, 0, 0);

      const endOfDepartureDate = new Date(utcDepartureTime);
      endOfDepartureDate.setUTCHours(23, 59, 59, 999);

      const data = await this.prisma.flights.findMany({
        where: {
          departure_airport_id: departure_Id,
          arrival_airport_id: arrival_Id,
          departure_time: {
            gte: startOfDepartureDate,
            lte: endOfDepartureDate,
          },
        },
        include: {
          airports_flights_departure_airport_idToairports: true,
          airports_flights_arrival_airport_idToairports: true,
        },
      });
      if (data) {
        return {
          data,
          message: 'Get flights by departure and arrival successfully',
          status: HttpStatus.OK,
          date: new Date(),
        };
      } else {
        throw new HttpException('No flight found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'An error occurred while processing your request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  generateRandomNumber(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }
    return parseInt(result);
  }

  async addFlight(CreateFlightDto) {
    try {
      const {
        flight_number,
        departure_airport_id,
        arrival_airport_id,
        departure_time,
        arrival_time,
        price,
      } = CreateFlightDto;

      // Kiểm tra sân bay khởi hành và sân bay đến có tồn tại không
      const departureAirport = await this.prisma.airports.findFirst({
        where: { airport_id: departure_airport_id },
      });
      if (!departureAirport) {
        throw new HttpException(
          'Departure airport not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const arrivalAirport = await this.prisma.airports.findFirst({
        where: { airport_id: arrival_airport_id },
      });
      if (!arrivalAirport) {
        throw new HttpException(
          'Arrival airport not found',
          HttpStatus.NOT_FOUND,
        );
      }

      // Kiểm tra thời gian khởi hành phải trước thời gian đến
      if (new Date(departure_time) >= new Date(arrival_time)) {
        throw new HttpException(
          'Departure time must be before arrival time',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Kiểm tra giá phải hợp lệ
      if (price <= 0) {
        throw new HttpException(
          'Price must be a positive number',
          HttpStatus.BAD_REQUEST,
        );
      }

      const flightNumber = `${flight_number}-${this.generateRandomNumber(4)}`;
      const data = await this.prisma.flights.create({
        data: {
          flight_number: flightNumber,
          departure_airport_id,
          arrival_airport_id,
          departure_time,
          arrival_time,
          price,
          created_at: new Date(),
        },
      });
      if (data) {
        return {
          data,
          message: 'Flight added successfully',
          status: HttpStatus.CREATED,
          date: new Date(),
        };
      }
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'An error occurred while processing your request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllFlights() {
    try {
      const data = await this.prisma.flights.findMany({
        include: {
          airports_flights_departure_airport_idToairports: true,
          airports_flights_arrival_airport_idToairports: true,
        },
      });
      if (data) {
        return {
          data,
          message: 'Get all flights successfully',
          status: HttpStatus.OK,
          date: new Date(),
        };
      }
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'An error occurred while processing your request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getFlightById(id: number) {
    const flight_id = parseInt(id.toString());
    try {
      const data = await this.prisma.flights.findFirst({
        where: {
          flight_id: flight_id,
        },
        include: {
          airports_flights_departure_airport_idToairports: true,
          airports_flights_arrival_airport_idToairports: true,
        },
      });
      if (data) {
        return {
          data,
          message: 'Get flight by ID successfully',
          status: HttpStatus.OK,
          date: new Date(),
        };
      } else {
        throw new HttpException('No flight found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.log(error);
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
