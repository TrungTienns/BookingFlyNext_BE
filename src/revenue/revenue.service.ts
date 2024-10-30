import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RevenueService {
  constructor(private prisma: PrismaClient) {}

  async calculateAndSaveFlightRevenue(flightId) {
    const parsedFlightId = parseInt(flightId, 10);

    if (isNaN(parsedFlightId)) {
      throw new Error(`Invalid flightId: ${flightId}`);
    }

    const totalRevenue = await this.prisma.tickets.aggregate({
      _sum: { total_price: true },
      where: { flight_id: parsedFlightId },
    });

    const totalTickets = await this.prisma.tickets.count({
      where: { flight_id: parsedFlightId },
    });

    const updatedRevenue = await this.prisma.revenueByFlights.upsert({
      where: { rbf_id: parsedFlightId },
      update: {
        revenue: totalRevenue._sum.total_price || 0,
        total_tickets: totalTickets,
      },
      create: {
        flight_id: parsedFlightId,
        revenue: totalRevenue._sum.total_price || 0,
        total_tickets: totalTickets,
        ratio: 0,
      },
      select: {
        flight_id: true,
        revenue: true,
        total_tickets: true,
        ratio: true,
      },
    });

    return updatedRevenue;
  }

  async calculateAndSaveYearRevenue(year) {
    // Initialize an array for monthly revenues
    const monthlyRevenue = Array(12).fill(0);

    // Loop through each month to calculate monthly revenue
    for (let month = 0; month < 12; month++) {
      const startDate = new Date(parseInt(year), month, 1);
      const endDate = new Date(parseInt(year), month + 1, 1);

      const monthlyTotal = await this.prisma.tickets.aggregate({
        _sum: { total_price: true },
        where: {
          flights: {
            departure_time: {
              gte: startDate,
              lt: endDate,
            },
          },
        },
      });

      monthlyRevenue[month] = monthlyTotal._sum.total_price || 0;
    }

    // Calculate yearly revenue
    const totalRevenue = monthlyRevenue.reduce((acc, curr) => acc + curr, 0);

    const updatedYearRevenue = await this.prisma.revenueByYear.upsert({
      where: { rby_id: parseInt(year) },
      update: { revenue: totalRevenue },
      create: {
        rby_id: parseInt(year),
        revenue: totalRevenue,
        total_flights: await this.prisma.flights.count({
          where: {
            departure_time: {
              gte: new Date(`${parseInt(year)}-01-01T00:00:00.000Z`),
              lt: new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`),
            },
          },
        }),
        ratio: 0,
      },
    });

    return {
      ...updatedYearRevenue,
      monthlyRevenue, // Include monthly revenue in the response
    };
  }
}
