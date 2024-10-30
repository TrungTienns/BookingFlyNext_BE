import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService, PrismaClient],
})
export class FriendsModule {}
