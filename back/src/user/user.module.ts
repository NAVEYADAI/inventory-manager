import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Password } from 'src/password/password.entity';
import { UserPermission } from 'src/use-permissions/use-permission.entity';
import { Company } from 'src/company/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserPermission, Password, Company]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
