import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Laptop',
    description: 'The name of the product',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'laptop',
    description: 'A high-performance laptop with 16GB RAM and 512GB SSD.',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    example: 1200,
    description: 'The price of the product',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @ApiProperty({
    example: 'Electronics',
    description: 'The category of the product',
  })
  @IsNotEmpty()
  @IsString()
  readonly category: string;
}
