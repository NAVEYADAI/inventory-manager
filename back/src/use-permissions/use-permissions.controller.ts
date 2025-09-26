import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserPermissionsService } from './use-permissions.service';
import { CreateUsePermissionDto } from './dto/create-use-permission.dto';
import { UpdateUsePermissionDto } from './dto/update-use-permission.dto';

@Controller('use-permissions')
export class UserPermissionsController {
  constructor(private readonly UserPermissionsService: UserPermissionsService) {}

  @Post()
  create(@Body() createUsePermissionDto: CreateUsePermissionDto) {
    return this.UserPermissionsService.create(createUsePermissionDto);
  }

  @Get()
  findAll() {
    return this.UserPermissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.UserPermissionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsePermissionDto: UpdateUsePermissionDto) {
    return this.UserPermissionsService.update(+id, updateUsePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.UserPermissionsService.remove(+id);
  }
}
