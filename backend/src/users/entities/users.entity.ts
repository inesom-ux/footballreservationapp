import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from 'src/auth/enums/roles.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  // @Prop()
  // _id: string;

  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // phoneNumber is optional at creation time (frontend may not always provide it)
  @Prop({ required: false })
  phoneNumber?: string;

  @Prop()
  birthDate: Date;

  // isActive indicates whether the user account is active or banned for example from the Admin or Deleted
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
