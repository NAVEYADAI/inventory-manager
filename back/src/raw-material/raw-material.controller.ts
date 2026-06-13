import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RawMaterialService } from './raw-material.service';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto';

@Controller('raw-material')
export class RawMaterialController {
  constructor(private readonly rawMaterialService: RawMaterialService) {}

  @Post('bulk')
  createBulk(@Body() createRawMaterialDto: CreateRawMaterialDto) {
    return this.rawMaterialService.createBulk(createRawMaterialDto);
  }

  @Get()
  findAll(@Query('subscriptionId') subscriptionId?: string) {
    if (subscriptionId) return this.rawMaterialService.findAllForSubscription(+subscriptionId);
    return this.rawMaterialService.findAllForSubscription(0 as any);
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
