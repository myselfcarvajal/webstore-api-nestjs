import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SigninDto {
  @ApiProperty({ example: 'will@gmail.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'The password of the user (maximum 22 characters)',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    example: 'Mario',
    description: 'The name of the user',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'Santos',
    description: 'The surname of the user',
  })
  @IsNotEmpty()
  @IsString()
  readonly surname: string;

  @ApiProperty({ example: 'mariosantos@gmail.com' })
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
}
