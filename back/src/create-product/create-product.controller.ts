import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateProductService } from './create-product.service';
import { CreateCreateProductDto } from './dto/create-create-product.dto';
import { UpdateCreateProductDto } from './dto/update-create-product.dto';

@Controller('create-product')
export class CreateProductController {
  constructor(private readonly createProductService: CreateProductService) {}

  @Post()
  create(@Body() createCreateProductDto: CreateCreateProductDto) {
    return this.createProductService.create(createCreateProductDto);
  }

  @Get()
  findAll() {
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
