import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';

class ProductItemDto {
  @ApiProperty({ example: '675cedc90e05808bcd4dc2c5' })
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @ApiProperty({
    example: 2,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Quantity must be greater than 0' })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    type: [ProductItemDto],
    example: [
      {
        productId: '675cedc90e05808bcd4dc2c5',
        quantity: 1,
      },
      {
        productId: '675cf5d7445440f076ab692e',
        quantity: 3,
      },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true }) // Asegura la validación anidada
  @Type(() => ProductItemDto) // Transforma los elementos del array a `ProductItemDto`
  products: ProductItemDto[];
}
