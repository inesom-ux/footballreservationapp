import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StadiumModule } from './stadium/stadium.module';
//import { SessionModule } from './session/session.module';
//import { ReservationModule } from './reservation/reservation.module';
//import { PlayerListModule } from './player-list/player-list.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({ isGlobal: true }),

    // MongoDB connection using ConfigService
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), // extracte it from .env
       }),
    }),


    AuthModule,
    UsersModule,
    StadiumModule,
    //SessionModule,
    //ReservationModule,
    //PlayerListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
