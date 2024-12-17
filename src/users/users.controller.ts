import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthSwagger } from 'src/common/decorator/auth-swagger.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @AuthSwagger()
  @ApiCreatedResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @AuthSwagger()
  @ApiOkResponse({ description: 'Ok' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @AuthSwagger()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @AuthSwagger()
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Invalid id format' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async findById(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @AuthSwagger()
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Invalid id format' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @AuthSwagger()
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Invalid id format' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.usersService.remove(id);
  }
}
