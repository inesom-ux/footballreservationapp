import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../entities/users.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { QueryUserDto } from '../dto/query-user.dto';
import { UserRole } from 'src/auth/enums/roles.enum';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}


   //Create a new user, admin can set role but normal users cannot ofc
  async create(userData: Partial<User>, currentUser?: User): Promise<Partial<User>> {
    
    // to prevent duplicate emails
    const existingUser = await this.userModel.findOne({ email: userData.email }).exec();
    if (existingUser) {
      throw new BadRequestException('Email already attached to an account');
    }

    // Only admin can assign a role
    let role: UserRole = UserRole.USER;
    if (userData.role) {
      if (!currentUser || currentUser.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Only admin can assign roles!');
      }
      role = userData.role;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password!, 10);

    const user = new this.userModel({
      ...userData,
      password: hashedPassword,
      role,
    });

    const savedUser = await user.save();

    // remove sensitive fields before returning
    const { password, ...result } = savedUser.toObject();
    return result;
  }

  //Find all users with optional query filters

  async findAll(query?: QueryUserDto): Promise<Partial<User>[]> {
    const filter: any = {};

    if (query) {
      if (query.role) filter.role = query.role;
      if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';
      if (query.username) filter.username = { $regex: query.username, $options: 'i' };
      if (query.email) filter.email = { $regex: query.email, $options: 'i' };
    }

    const users = await this.userModel.find(filter).exec();

    return users.map(({ password, ...rest }) => rest);
  }

  async findById(id: string): Promise<Partial<User>> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');

    const { password, ...result } = user.toObject();
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  // only admin can change role or isActive

  async update(id: string, updateUserDto: UpdateUserDto, currentUser?: User): Promise<Partial<User>> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');

    // just for admins
    if ((updateUserDto.role || updateUserDto.isActive !== undefined) && currentUser?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admin can update role or isActive');
    }

    // Prevent email duplication
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userModel.findOne({ email: updateUserDto.email }).exec();
      if (existingUser) throw new BadRequestException('Email already exists');
    }

    // If password update, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Assign only defined fields from the DTO to avoid overwriting existing values
    // with `undefined` when the client sends a partial update.
    Object.entries(updateUserDto).forEach(([key, value]) => {
      if (value === undefined) return; // skip undefined fields
      if (key === 'confirmPassword') return; // DTO-only helper field, not stored
      // set the field on the mongoose document
      (user as any)[key] = value;
    });

    const updatedUser = await user.save();

    const { password, ...result } = updatedUser.toObject();
    return result;
  }

async remove(id: string, currentUser: User): Promise<{ message: string }> {
  if (currentUser.role !== UserRole.ADMIN) {
    throw new ForbiddenException('Only admin can delete users');
  }

  const user = await this.userModel.findById(id).exec();
  if (!user) throw new NotFoundException('User not found');

  await this.userModel.deleteOne({ _id: id }).exec();
  return { message: 'User deleted successfully' };
}


  // search users by username/email
  async searchByUsernameOrEmail(search: string): Promise<Partial<User>[]> {
    const users = await this.userModel
      .find({
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      })
      .exec();
    // it returns everything except password, for security reasons so that password hashes are not exposed
    return users.map(({ password, ...rest }) => rest);
  }
}
