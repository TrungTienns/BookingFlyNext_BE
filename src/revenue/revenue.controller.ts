import { Controller, Get, Param } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Revenue')
@Controller('revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  @Get('flight/:id')
  async calculateFlightRevenue(@Param('id') id: number) {
    const result = await this.revenueService.calculateAndSaveFlightRevenue(id);
    return {
      message: 'Flight revenue calculated and saved successfully',
      data: result,
    };
  }

  @Get('year/:year')
  async calculateYearRevenue(@Param('year') year: number) {
    const result = await this.revenueService.calculateAndSaveYearRevenue(year);
    return {
      message: 'Year revenue calculated and saved successfully',
      data: result,
    };
  }
}
