import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './tag.entity';
import { Subscription } from 'src/subscription/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag, Subscription])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
