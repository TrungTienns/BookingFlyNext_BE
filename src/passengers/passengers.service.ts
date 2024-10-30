import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PassengersService {
  constructor(private prisma: PrismaClient) {}
}
