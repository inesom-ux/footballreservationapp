import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stadium, StadiumDocument } from '../entities/stadium.entity';
import { CreateStadiumDto } from '../dto/create-stadium.dto';
import { UpdateStadiumDto } from '../dto/update-stadium.dto';
import { QueryStadiumDto } from '../dto/query-stadium.dto';

@Injectable()
export class StadiumService {
  constructor(
    @InjectModel(Stadium.name)
    private readonly stadiumModel: Model<StadiumDocument>,
  ) {}

  // Create a new stadium
  async create(createStadiumDto: CreateStadiumDto): Promise<Stadium> {
    const newStadium = new this.stadiumModel(createStadiumDto);
    try {
      return await newStadium.save();
    } catch (err: any) {
      // handle duplicate key (name unique) gracefully
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err && (err.code === 11000 || err.code === '11000')) {
        throw new ConflictException('Stadium with this name already exists');
      }
      console.error('Unexpected error saving stadium:', err);
      throw new InternalServerErrorException('Failed to save stadium');
    }
  }

  // Find all stadiums or filter by query
  async find(query: QueryStadiumDto): Promise<Stadium[]> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const filter: any = {};

    // Filtering by name (case-insensitive)
    if (query.name) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      filter.name = { $regex: query.name, $options: 'i' };
    }

    // Filtering by location (case-insensitive)
    if (query.location) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      filter.location = { $regex: query.location, $options: 'i' };
    }

    // Filtering by capacity range (a supprimer)
    if (query.minCapacity || query.maxCapacity) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      filter.capacity = {};
      if (query.minCapacity !== undefined)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        filter.capacity.$gte = query.minCapacity;
      if (query.maxCapacity !== undefined)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        filter.capacity.$lte = query.maxCapacity;
    }

    // Filtering by amenities
    if (query.amenities && query.amenities.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      filter.amenities = { $all: query.amenities };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.stadiumModel.find(filter).exec();
  }

  // Find one stadium by ID
  async findOne(id: string): Promise<Stadium> {
    const stadium = await this.stadiumModel.findById(id).exec();
    if (!stadium)
      throw new NotFoundException(`Stadium with ID ${id} not found`);
    return stadium;
  }

  // Update stadium by ID
  async update(
    id: string,
    updateStadiumDto: UpdateStadiumDto,
  ): Promise<Stadium> {
    const updated = await this.stadiumModel
      .findByIdAndUpdate(id, updateStadiumDto, {
        new: true, // return the updated document
        runValidators: true, // run schema validators
      })
      .exec();

    if (!updated)
      throw new NotFoundException(`Stadium with ID ${id} not found`);
    return updated;
  }

  // Delete stadium by ID
  async delete(id: string): Promise<{ message: string }> {
    const deleted = await this.stadiumModel.findByIdAndDelete(id).exec();
    if (!deleted)
      throw new NotFoundException(`Stadium with ID ${id} not found`);
    return { message: 'Stadium deleted successfully' };
  }
}
