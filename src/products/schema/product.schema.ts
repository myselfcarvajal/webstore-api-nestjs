import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Product {}

export const ProductSchema = SchemaFactory.createForClass(Product);
