import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportEntity } from 'src/libs/entities/export.entity';
import { ProductEntity } from 'src/libs/entities/product.entity';
import { ProductService } from '../product/product.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { ExportService } from './export.service';
import { ExportResolver } from './export.resolver';
import { WarehouseEntity } from 'src/libs/entities/warehouse.entity';

@Module({
  providers: [ExportResolver, ExportService, ProductService, WarehouseService],
  imports: [
    TypeOrmModule.forFeature([ExportEntity, ProductEntity, WarehouseEntity]),
  ],
  exports: [ExportService],
})
export class ExportModule {}
