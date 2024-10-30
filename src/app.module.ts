import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AirportsModule } from './airports/airports.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FlightsModule } from './flights/flights.module';
import { PassengersModule } from './passengers/passengers.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TicketModule } from './ticket/ticket.module';
import { UsersModule } from './users/users.module';
import { ChatGateway } from './gateway/chat.gateway';
import { FriendsModule } from './friends/friends.module';
import { RevenueModule } from './revenue/revenue.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    AirportsModule,
    FlightsModule,
    TicketModule,
    PassengersModule,
    FriendsModule,
    RevenueModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, ChatGateway],
})
export class AppModule {}
