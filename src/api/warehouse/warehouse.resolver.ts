import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseInput, UpdateWarehouseInput } from 'src/types/graphql';

@Resolver('Warehouse')
export class WarehouseResolver {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Mutation('createWarehouse')
  public async createWarehouse(
    @Args('CreateWarehouseInput') createWarehouseInput: CreateWarehouseInput,
  ) {
    return this.warehouseService.createWarehouse(createWarehouseInput);
  }

  @Mutation('updateWarehouse')
  public async updateWarehouse(
    @Args('UpdateWarehouseInput') updateWarehouseInput: UpdateWarehouseInput,
  ) {
    return await this.warehouseService.updateWarehouse(updateWarehouseInput);
  }

  @Mutation('deleteWarehouse')
  public async remove(@Args('id') id: string) {
    return await this.warehouseService.deleteWarehouse(id);
  }

  @Query()
  public async findAllWarehouses() {
    return await this.warehouseService.findAllWarehouses();
  }

  @Query()
  public async findWarehouseById(@Args('id') id: string) {
    return await this.warehouseService.findWarehouseById(id);
  }

  @Query()
  public async getWarehouseStockCurrentCapacity(@Args('id') id: string) {
    return await this.warehouseService.getWarehouseStockCurrentCapacity(id);
  }
}
