import { PartialType } from '@nestjs/mapped-types';
import { CreateUsePermissionDto } from './create-use-permission.dto';

export class UpdateUsePermissionDto extends PartialType(CreateUsePermissionDto) {}
