import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { RegisterDto } from '../../dto/register.dto';
import { LoginDto } from '../../dto/login.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { Public } from '../../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    // debug: log the parsed body to help identify validation issues from client
    // (Postman must send JSON with header 'Content-Type: application/json')
    console.debug('Register endpoint received body:', registerDto);
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  // Protected route, returns logged-in user info
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req) {
    // req.user can be a Mongoose document, a plain object, or an object with a `_doc` wrapper.
    // Normalize to a plain object and strip sensitive/internal fields.
    const raw = typeof req.user?.toObject === 'function' ? req.user.toObject() : { ...req.user };
    const userObj = (raw && (raw as any)._doc) ? (raw as any)._doc : raw;
    const { password, __v, ...userWithoutPassword } = userObj as any;
    // remove Mongoose internals if present
    if ((userWithoutPassword as any).$__) delete (userWithoutPassword as any).$__;
    if ((userWithoutPassword as any).$isNew) delete (userWithoutPassword as any).$isNew;
    return userWithoutPassword;
  }
}
