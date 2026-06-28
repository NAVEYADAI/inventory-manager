import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Headers } from '@nestjs/common';
import { CreateProductService } from './create-product.service';
import { CreateCreateProductDto } from './dto/create-create-product.dto';
import { UpdateCreateProductDto } from './dto/update-create-product.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('create-product')
export class CreateProductController {
  constructor(
    private readonly createProductService: CreateProductService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(
    @Headers('authorization') authHeader: string,
    @Body() createCreateProductDto: CreateCreateProductDto,
  ) {
    let userId: number | undefined;
    if (authHeader) {
      try {
        const user = await this.authService.validateToken(authHeader);
        userId = user.id;
      } catch (e) {
        // Ignore or log error
      }
    }
    return this.createProductService.create(createCreateProductDto, userId);
  }

  @Get()
  findAll(@Query('subscriptionId') subscriptionId?: string) {
    if (subscriptionId) {
      return this.createProductService.findAllForSubscription(+subscriptionId);
    }
    return this.createProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.createProductService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreateProductDto: UpdateCreateProductDto) {
    return this.createProductService.update(+id, updateCreateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.createProductService.remove(+id);
  }
}
