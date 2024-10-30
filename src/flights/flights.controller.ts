import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateFlightDto } from './flight-dto/create-flight-dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Flights')
@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Post('add-flight')
  @UseGuards(AuthGuard('jwt'))
  addFlight(@Body() CreateFlightDto: CreateFlightDto) {
    return this.flightsService.addFlight(CreateFlightDto);
  }

  @Get('get-all-flights')
  getAllFlights() {
    return this.flightsService.getAllFlights();
  }

  @Get('get-flight-by-id/:id')
  getFlightById(@Param('id') id: number) {
    return this.flightsService.getFlightById(id);
  }

  @ApiParam({
    name: 'departureTime',
    description: 'The departure time of the flight',
  })
  @ApiParam({
    name: 'arrivalId',
    description: 'The ID of the arrival airport',
  })
  @ApiParam({
    name: 'departureId',
    description: 'The ID of the departure airport',
  })
  @Get(
    'get-by-departure-arrival-departureTime/:departureId/:arrivalId/:departureTime',
  )
  getFlightsByDepartureArrival(
    @Param('departureId') departureId: any,
    @Param('arrivalId') arrivalId: any,
    @Param('departureTime') departureTime: any,
  ) {
    return this.flightsService.getFlightsByDepartureArrival(
      departureId,
      arrivalId,
      departureTime,
    );
  }
}
