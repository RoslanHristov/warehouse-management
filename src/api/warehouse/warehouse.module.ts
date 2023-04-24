import { Module } from '@nestjs/common';
import { WarehouseResolver } from './warehouse.resolver';
import { WarehouseService } from './warehouse.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseEntity } from 'src/libs/entities/warehouse.entity';

@Module({
  providers: [WarehouseResolver, WarehouseService],
  imports: [TypeOrmModule.forFeature([WarehouseEntity])],
  exports: [WarehouseService],
})
export class WarehouseModule {}
