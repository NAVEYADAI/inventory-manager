import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './company.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { User } from 'src/user/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { UserPermission } from 'src/use-permissions/use-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, Subscription, User, UserPermission]),
    AuthModule,
    UserModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
