import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/libs/entities/product.entity';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { WarehouseEntity } from 'src/libs/entities/warehouse.entity';
import { WarehouseService } from '../warehouse/warehouse.service';

@Module({
  providers: [ProductResolver, ProductService, WarehouseService],
  imports: [TypeOrmModule.forFeature([ProductEntity, WarehouseEntity])],
  exports: [ProductService],
})
export class ProductModule {}
