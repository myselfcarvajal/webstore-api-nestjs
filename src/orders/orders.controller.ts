import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { GetCurrentUserId } from 'src/common/decorator/get-current-user-id.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { AuthSwagger } from 'src/common/decorator/auth-swagger.decorator';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('me')
  @AuthSwagger()
  @ApiOkResponse({
    description: 'OK',
  })
  async getOrderByUserId(@GetCurrentUserId() id: string) {
    return this.ordersService.getOrderByUserId(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.CLIENTE)
  @AuthSwagger()
  @ApiCreatedResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiForbiddenResponse({
    description: 'Forbidden resource, only client can order',
  })
  async create(
    @GetCurrentUserId() orderBy: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(createOrderDto, orderBy);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @AuthSwagger()
  @ApiCreatedResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiForbiddenResponse({
    description: 'Forbidden resource, only admin can see the orders',
  })
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @AuthSwagger()
  @ApiOkResponse({ description: 'Ok' })
  @ApiForbiddenResponse({
    description: 'Forbidden resource only admin can see the stats',
  })
  async getOrdersStats() {
    return this.ordersService.getOrdersStats();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @AuthSwagger()
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Invalid id format' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async findById(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.ordersService.findById(id);
  }
}
