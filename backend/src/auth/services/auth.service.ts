import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { User } from '../../users/entities/users.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const {
      username,
      email,
      password,
      confirmPassword,
      phoneNumber,
      birthDate,
    } = registerDto;

    // ensure passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // check for existing user with same email
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // create user (UsersService.create will hash the password)
    const user: Partial<User> = {
      username,
      email,
      password,
      phoneNumber,
      birthDate: birthDate ? new Date(birthDate) : undefined, // convert string to Date since birthDate is Date inside User entity
    };

    try {
      await this.usersService.create(user);
      return { message: 'User registered successfully' };
    } catch (error) {
      // Log internal error for debugging (do not expose details to client)
      console.error('Error during registration:', error);
      throw error;
    }
  }

  /**
   * @method login
   * @description Validate credentials and return JWT token
   */
  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;

    // find user by email
    const user = await this.usersService.findByEmail(email);
    // debug: log whether user was found (do not log plain password)
    console.debug('Login attempt for email:', email, ' - user found:', !!user);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.debug('Password compare result for', email, ':', isPasswordValid);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

  // create and sign JWT token
  // user may be a plain object (User) or a Mongoose document that exposes _id or id.
  // Use a safe cast to access the identifier without causing TS errors.
  const userId = (user as any)?._id ?? (user as any)?.id;
  const payload = { sub: userId, email: user.email, role: user.role };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '1h',
    });

    return { access_token };
  }

  /**
   * @method validateUser
   * @description Used internally by Passport strategy to validate user
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  /**
   * @method decodeToken
   * @description Optional utility to decode a JWT token (for internal use)
   */
  async decodeToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
  async findUserByEmail(email: string): Promise<User | null> {
    return this.usersService.findByEmail(email);
  }
}
