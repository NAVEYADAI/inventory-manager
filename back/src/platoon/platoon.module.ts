import { Module } from '@nestjs/common';
import { PlatoonService } from './platoon.service';
import { PlatoonController } from './platoon.controller';

@Module({
  controllers: [PlatoonController],
  providers: [PlatoonService],
})
export class PlatoonModule {}
