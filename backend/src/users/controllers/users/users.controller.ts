import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { UserRole } from '../../../auth/enums/roles.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Normalize and extract an identifier from Passport/Nest `req.user` which may be
  // a plain object, a Mongoose document, or contain a `_doc` wrapper. Returns a string id or undefined.
  private resolveAuthId(user: any): string | undefined {
    if (!user) return undefined;
    if (typeof user === 'string') return user;
    // common fields
    if (user.id) return String(user.id);
    if (user._id) return String(user._id);
    if (user.sub) return String(user.sub);

    // Mongoose document: try toObject()
    if (typeof user.toObject === 'function') {
      try {
        const obj = user.toObject();
        if (obj.id) return String(obj.id);
        if (obj._id) return String(obj._id);
        if (obj.sub) return String(obj.sub);
        if (obj._doc) {
          const d = obj._doc;
          if (d.id) return String(d.id);
          if (d._id) return String(d._id);
          if (d.sub) return String(d.sub);
        }
      } catch (e) {
        // ignore and continue
      }
    }

    // direct _doc access
    if (user._doc) {
      const d = user._doc;
      if (d.id) return String(d.id);
      if (d._id) return String(d._id);
      if (d.sub) return String(d.sub);
    }

    return undefined;
  }

  // ADMIN create new user manually
  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateUserDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    return await this.usersService.create(dto);
  }

  // get all users with optional search/filter (only admin)
  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@Query('search') search?: string) {
    if (search) {
      return this.usersService.searchByUsernameOrEmail(search);
    }
    return await this.usersService.findAll();
  }

  // Get current user info
  @Get('me')
  async getMe(@Req() req) {
    const authId = this.resolveAuthId(req.user);
    const user = await this.usersService.findById(authId as string);
    const { password, ...rest } = user;
    return rest;
  }

  // Get a specific user by ID (only admin)
  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    const { password, ...rest } = user;
    return rest;
  }

  // Update own profile
  @Patch('me')
  async updateMe(@Req() req, @Body() dto: UpdateUserDto) {
    if ((dto as any).role) delete (dto as any).role; // users can't change role
    if (dto.password && dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // debug: show req.user and computed authId
  console.debug('updateMe - req.user:', req.user);
  const authId = this.resolveAuthId(req.user);
  console.debug('updateMe - computed authId:', authId);
  const updatedUser = await this.usersService.update(authId as string, dto);
    const { password, ...rest } = updatedUser;
    return rest;
  }

  // Update any user by ID (only admin)
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() req) {
    if (dto.password && dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // pass the authenticated user to allow UsersService to validate admin-only changes
    const updatedUser = await this.usersService.update(id, dto, req.user);
    const { password, ...rest } = updatedUser;
    return rest;
  }

  // Delete user by ID (only admin)
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string, @Req() req) {
    return await this.usersService.remove(id, req.user);
  }
}
