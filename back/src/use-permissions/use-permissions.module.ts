import { Module } from '@nestjs/common';
import { UserPermissionsService } from './use-permissions.service';
import { UserPermissionsController } from './use-permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermission } from './use-permission.entity';
import { User } from 'src/user/user.entity';
import { Company } from 'src/company/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPermission,User, Company])],
  controllers: [UserPermissionsController],
  providers: [UserPermissionsService],
})
export class UserPermissionsModule {}
