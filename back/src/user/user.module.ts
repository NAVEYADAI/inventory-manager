import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { Password } from 'src/password/password.entity';
import { Subscription } from 'src/subscription/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Password, Subscription])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
