import { Module } from '@nestjs/common';
import { InvetoryService } from './invetory.service';
import { InvetoryController } from './invetory.controller';

@Module({
  controllers: [InvetoryController],
  providers: [InvetoryService],
})
export class InvetoryModule {}
