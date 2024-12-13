import { Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Order {}

export const OrderSchema = SchemaFactory.createForClass(Order);
