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
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('stadium')
export class StadiumController {
  constructor(private readonly stadiumService: StadiumService) {}

  // ================= Create a stadium =================
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Req() req: any, @Body() createStadiumDto: CreateStadiumDto) {
    try {
      return await this.stadiumService.create(createStadiumDto);
    } catch (error: any) {
      // If service threw a Nest HttpException (e.g., ConflictException), rethrow so client gets proper status
      if (error instanceof HttpException) {
        throw error;
      }
      // Log full unexpected error and return 500
      console.error('Error creating stadium:', error);
      throw new InternalServerErrorException('Failed to create stadium');
    }
  }

  // ================= Get all stadiums or filter =================
  @Get()
  async findAll(@Query() query: QueryStadiumDto) {
    // @Query() maps query parameters (e.g., /stadiums?name=Arena&location=Paris) to DTO
    console.debug('Stadium findAll query:', query);
    return this.stadiumService.find(query);
  }

  // ================= Get a single stadium by ID =================
  @Get(':id')
  async findOne(@Param('id') id: string) {
    // @Param('id') maps the route parameter to the method argument
    console.debug('Stadium findOne id:', id);
    return this.stadiumService.findOne(id);
  }

  // ================= Update a stadium =================
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Only authenticated users (admins) can update
  async update(
    @Param('id') id: string,
    @Body() updateStadiumDto: UpdateStadiumDto,
  ) {
    return this.stadiumService.update(id, updateStadiumDto);
  }

  // ================= Delete a stadium =================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Only authenticated users (admins) can delete
  @HttpCode(HttpStatus.NO_CONTENT) // Returns 204 on success
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.stadiumService.delete(id);
  }
}
