import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportEntity } from 'src/libs/entities/import.entity';
import { ProductEntity } from 'src/libs/entities/product.entity';
import { WarehouseEntity } from 'src/libs/entities/warehouse.entity';
import { ProductService } from '../product/product.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { ImportService } from './import.service';
import { ImportResolver } from './import.resolver';

@Module({
  providers: [ImportResolver, ImportService, ProductService, WarehouseService],
  imports: [
    TypeOrmModule.forFeature([ImportEntity, ProductEntity, WarehouseEntity]),
  ],
  exports: [ImportService],
})
export class ImportModule {}
