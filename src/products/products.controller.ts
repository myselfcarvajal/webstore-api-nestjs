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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id.pipe';
import { Public } from 'src/common/decorator/public.decorator';
import { GetCurrentUserId } from 'src/common/decorator/get-current-user-id.decorator';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
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

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @AuthSwagger()
  @ApiCreatedResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  @ApiForbiddenResponse({ description: 'Forbidden resource' })
  async create(
    @GetCurrentUserId() userId: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(createProductDto, userId);
  }

  @Public()
  @ApiOkResponse({ description: 'Ok' })
  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Public()
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Invalid id format' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':id')
  async findById(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.productsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @AuthSwagger()
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Invalid id format' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @AuthSwagger()
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Invalid id format' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  async remove(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.productsService.remove(id);
  }
}
