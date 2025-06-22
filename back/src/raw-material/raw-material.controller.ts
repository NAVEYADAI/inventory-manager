import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RawMaterialService } from './raw-material.service';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';

@Controller('raw-material')
export class RawMaterialController {
  constructor(private readonly rawMaterialService: RawMaterialService) {}

  @Post()
  create(@Body() createRawMaterialDto: CreateRawMaterialDto) {
    return this.rawMaterialService.create(createRawMaterialDto);
  }

  @Get()
  findAll() {
    return this.rawMaterialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rawMaterialService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRawMaterialDto: UpdateRawMaterialDto) {
    return this.rawMaterialService.update(+id, updateRawMaterialDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rawMaterialService.remove(+id);
  }
}
