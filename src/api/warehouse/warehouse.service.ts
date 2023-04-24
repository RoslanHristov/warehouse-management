import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WarehouseEntity } from 'src/libs/entities/warehouse.entity';
import { CreateWarehouseInput, UpdateWarehouseInput } from 'src/types/graphql';
import { Repository } from 'typeorm';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepository: Repository<WarehouseEntity>,
  ) {}

  async createWarehouse(createWarehouseInput: CreateWarehouseInput) {
    try {
      const newWarehouse =
        this.warehouseRepository.create(createWarehouseInput);
      newWarehouse.stockCurrentCapacity = 0;
      await this.warehouseRepository.save(newWarehouse);
      return newWarehouse;
    } catch (error) {
      if (error.code === '23505') {
        // Postgres unique constraint violation error code
        throw new ConflictException(
          `Warehouse with name "${createWarehouseInput.name}" already exists`,
        );
      }
      throw error;
    }
  }

  async findAllWarehouses() {
    const allWarehouses = await this.warehouseRepository.find();
    if (allWarehouses.length === 0) {
      throw new BadRequestException('No warehouses found');
    }
    return allWarehouses;
  }

  async findWarehouseById(id: string) {
    const warehouse = await this.warehouseRepository.findOneBy({ id });
    if (!warehouse) {
      throw new BadRequestException(
        'Cannot find warehouse with the provided id',
      );
    }
    return warehouse;
  }

  async updateWarehouse(updateWarehouseInput: UpdateWarehouseInput) {
    const id: string = updateWarehouseInput.id;
    const warehouse = await this.findWarehouseById(id);

    Object.assign(warehouse, updateWarehouseInput); // Update the entity properties
    const updatedWarehouse = await this.warehouseRepository.save(warehouse); // Save the updated entity

    return updatedWarehouse;
  }

  async deleteWarehouse(id: string) {
    const warehouse = await this.warehouseRepository.findOneBy({ id });

    if (!warehouse) {
      throw new BadRequestException('No warehouse found');
    }

    if (warehouse.stockCurrentCapacity > 0) {
      throw new BadRequestException('Cannot delete warehouse with stock');
    }

    const removedWarehouse = await this.warehouseRepository.remove(warehouse);
    return `Successfully removed warehouse "${removedWarehouse.name}"`;
  }

  // Not sure if this is needed since you can get this info from getWarehouseById but it's in the requirements
  async getWarehouseStockCurrentCapacity(id: string): Promise<number> {
    const warehouse: WarehouseEntity = await this.warehouseRepository.findOneBy(
      { id },
    );
    if (!warehouse) {
      throw new BadRequestException('No warehouse found');
    }
    return warehouse.stockCurrentCapacity;
  }

  // Return the current stock amount per warehouse and in general and free stock space remaining.
  // async getWarehouseStockInfo() {
  //   const allWarehouses = await this.warehouseRepository.find();
  //   if (allWarehouses.length === 0) {
  //     throw new BadRequestException('No warehouses found');
  //   }

  //   const warehouseStockInfo = allWarehouses.map((warehouse) => {
  //     const { id, name, stockCurrentCapacity, stockMaxCapacity } = warehouse;
  //     return {
  //       id,
  //       name,
  //       stockCurrentCapacity,
  //       stockMaxCapacity,
  //       stockFreeCapacity: stockMaxCapacity - stockCurrentCapacity,
  //     };
  //   });

  //   const totalStockCurrentCapacity = allWarehouses.reduce(
  //     (acc, warehouse) => acc + warehouse.stockCurrentCapacity,
  //     0,
  //   );

  //   const totalStockMaxCapacity = allWarehouses.reduce(
  //     (acc, warehouse) => acc + warehouse.stockMaxCapacity,
  //     0,
  //   );

  //   const totalStockFreeCapacity =
  //     totalStockMaxCapacity - totalStockCurrentCapacity;

  //   return {
  //     warehouseStockInfo,
  //     totalStockCurrentCapacity,
  //     totalStockMaxCapacity,
  //     totalStockFreeCapacity,
  //   };
  // }
}
