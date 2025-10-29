import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './supplier.entity';
import { Company } from 'src/company/company.entity';
import { Invetory } from 'src/invetory/invetory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, Company, Invetory])],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
