import { Module } from '@nestjs/common';
import { UserPermissionsService } from './use-permissions.service';
import { UserPermissionsController } from './use-permissions.controller';

@Module({
  controllers: [UserPermissionsController],
  providers: [UserPermissionsService],
})
export class UserPermissionsModule {}
