import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  surname: string;

  @Prop({
    required: true,
    index: { unique: true },
    lowercase: true,
  })
  email: string;

  @Prop({ require: true })
  password: string;

  @Prop({
    example: ['admin', 'cliente'],
    enum: Role,
    required: true,
  })
  role: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
