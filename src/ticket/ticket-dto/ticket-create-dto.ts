import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreatePassengerDto } from 'src/passengers/passenger-dto/passenger-create-dto';

export class CreateTicketDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ticket_number: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  flight_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  ticket_class?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  passenger?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  total_price?: number;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  created_at?: Date;

  @ApiProperty({ type: [CreatePassengerDto] })
  @ValidateNested({ each: true })
  @Type(() => CreatePassengerDto)
  @IsOptional()
  passengers: CreatePassengerDto[];
}
