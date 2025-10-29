import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Subscription } from 'src/subscription/subscription.entity';
import { Supplier } from 'src/supplier/supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, Subscription, Supplier])],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
