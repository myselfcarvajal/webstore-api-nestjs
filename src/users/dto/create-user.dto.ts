import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'Will',
    description: 'The name of the user',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'Douglas',
    description: 'The surname of the user',
  })
  @IsNotEmpty()
  @IsString()
  readonly surname: string;

  @ApiProperty({ example: 'willdouglas@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: 'password',
    description: 'The password of the user (maximum 22 characters)',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(22, {
    message: 'Password cannot exceed 22 characters',
  })
  readonly password: string;

  @ApiProperty({
    example: 'admin',
  })
  @IsNotEmpty()
  @IsEnum(Role, {
    message: 'Valid role required (admin | cliente)',
  })
  readonly role: string;
}
