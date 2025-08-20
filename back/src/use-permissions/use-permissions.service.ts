import { Injectable } from '@nestjs/common';
import { CreateUsePermissionDto } from './dto/create-use-permission.dto';
import { UpdateUsePermissionDto } from './dto/update-use-permission.dto';

@Injectable()
export class UserPermissionsService {
  create(createUsePermissionDto: CreateUsePermissionDto) {
    return 'This action adds a new usePermission';
  }

  findAll() {
    return `This action returns all UserPermissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usePermission`;
  }

  update(id: number, updateUsePermissionDto: UpdateUsePermissionDto) {
    return `This action updates a #${id} usePermission`;
  }

  remove(id: number) {
    return `This action removes a #${id} usePermission`;
  }
}
