import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, SigninDto } from './dto/auth.dto';
import { Public } from 'src/common/decorator/public.decorator';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthSwagger } from 'src/common/decorator/auth-swagger.decorator';
import { GetCurrentUser } from 'src/common/decorator/get-current-user.decorator';
import { User } from 'src/users/schema/user.schema';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @AuthSwagger()
  @ApiOkResponse({
    description: 'OK',
  })
  getMe(@GetCurrentUser() user: User) {
    return user;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Ok' })
  @ApiUnauthorizedResponse({ description: 'Credentials incorrect' })
  @Post('login')
  signIn(@Body() signinDto: SigninDto) {
    return this.authService.signIn(signinDto.email, signinDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiConflictResponse({ description: 'Email already exists' })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
