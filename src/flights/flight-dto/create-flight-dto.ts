import { ApiProperty } from '@nestjs/swagger';
import {
  IsDecimal,
  IsOptional,
  IsString,
  IsInt,
  IsDate,
} from 'class-validator';

export class CreateFlightDto {
  @ApiProperty()
  @IsString()
  flight_number: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  departure_airport_id?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  arrival_airport_id?: number;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  departure_time?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  arrival_time?: Date;

  @ApiProperty()
  @IsInt()
  price: number;
}
