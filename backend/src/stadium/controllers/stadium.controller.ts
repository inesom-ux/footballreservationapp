/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Patch,
  Req,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { StadiumService } from '../services/stadium.service';
import { CreateStadiumDto } from '../dto/create-stadium.dto';
import { UpdateStadiumDto } from '../dto/update-stadium.dto';
import { QueryStadiumDto } from '../dto/query-stadium.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/enums/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
@Controller('stadium')
export class StadiumController {
  constructor(private readonly stadiumService: StadiumService) {}

  // ================= Create a stadium =================
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Req() req: any, @Body() createStadiumDto: CreateStadiumDto) {
    try {
      return await this.stadiumService.create(createStadiumDto);
    } catch (error: any) {
      // If service threw a Nest HttpException (for example ConflictException), rethrow so client gets proper status
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create stadium');
    }
  }

  // ================= Get all stadiums or filter =================
  @Get()
  async findAll(@Query() query: QueryStadiumDto) {
    // @Query() maps query parameters (example: /stadiums?name=Arena&location=Paris) to DTO
    return this.stadiumService.find(query);
  }

  // ================= Get a single stadium by ID =================
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // @Param('id') maps the route parameter to the method argument
    return this.stadiumService.findOne(id);
  }

  // ================= Update a stadium =================
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateStadiumDto: UpdateStadiumDto,
  ) {
  try {
    const result = await this.stadiumService.update(id, updateStadiumDto);
    return result;
  } catch (error) {
    console.error('Controller - Update failed:', error.message);
    throw error;
  }
  }

  // ================= Delete a stadium =================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT) // Returns 204 on success
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.stadiumService.delete(id);
  }
}
