import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AirportsService } from './airports.service';

@ApiTags('Airports')
@Controller('airports')
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  @Get('get-all-airports')
  getAllAirports() {
    return this.airportsService.getAllAirports();
  }

  @ApiParam({ name: 'id', description: 'ID of the airport' })
  @Get('get-airport-by-id/:id')
  getAirportById(@Param('id') id) {
    return this.airportsService.getAirportById(id);
  }

  @ApiParam({ name: 'name', description: 'Name of the airport' })
  @Get('get-airport-by-name/:name')
  getAirportByName(@Param('name') name) {
    return this.airportsService.getAirportByName(name);
  }
}
