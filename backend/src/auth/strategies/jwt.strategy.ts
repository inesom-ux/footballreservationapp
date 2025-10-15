import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/users.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService, // For secure env config
  ) {
    super({
      // this extracts JWT from Authorization header (Bearer token)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // reject if expired tokens
      secretOrKey: configService.get<string>('JWT_SECRET'), // securely read from .env
    });
  }

  /**
   * @method validate
   * @description Called automatically by Passport to validate the JWT payload
   * @param payload - Decoded JWT payload
   * @returns User object to attach to req.user
   */
  async validate(payload: any): Promise<Partial<User>> {

    // fetch full user info from DB
    const user = await this.authService.findUserByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('Invalid token or user does not exist');
    }

    // exclude sensitive fields before attaching to req.user
    const { password, ...result } = user;
    return result;
  }
}