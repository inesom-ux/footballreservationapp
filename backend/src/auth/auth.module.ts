import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule, // To access users for login & validation
    PassportModule.register({ defaultStrategy: 'jwt' }), // Passport JWT integration
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule to read .env
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Read JWT secret from .env
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1h', // Default 1h
        },
      }),
    }),
    ConfigModule, // Needed to inject ConfigService
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
