import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/subscription/subscription.entity';
import { UserPermission } from 'src/use-permissions/use-permission.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Subscription, UserPermission])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
