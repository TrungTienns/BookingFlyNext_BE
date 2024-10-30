import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePassengerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  passenger_name: string;

  @ApiProperty()
  @IsInt()
  gender: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  date_of_birth?: Date;

  @ApiProperty()
  @IsString()
  passport_number?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  type: string;
}
