import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';

@Schema({ timestamps: true })
export class Product {
  @Prop({ require: true })
  name: string;

  @Prop({ require: true })
  description: string;

  @Prop({ type: Number, require: true })
  price: number;

  @Prop({ require: true })
  category: string;

  // @Prop({ type: User, require: true })
  // createdBy: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: ObjectId;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
