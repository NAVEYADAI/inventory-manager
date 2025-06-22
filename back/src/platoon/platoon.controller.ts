import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlatoonService } from './platoon.service';
import { CreatePlatoonDto } from './dto/create-platoon.dto';
import { UpdatePlatoonDto } from './dto/update-platoon.dto';

@Controller('platoon')
export class PlatoonController {
  constructor(private readonly platoonService: PlatoonService) {}

  @Post()
  create(@Body() createPlatoonDto: CreatePlatoonDto) {
    return this.platoonService.create(createPlatoonDto);
  }

  @Get()
  findAll() {
    return this.platoonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.platoonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlatoonDto: UpdatePlatoonDto) {
    return this.platoonService.update(+id, updatePlatoonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.platoonService.remove(+id);
  }
}
