import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExportEntity } from 'src/libs/entities/export.entity';
import { ProductEntity } from 'src/libs/entities/product.entity';
import { WarehouseEntity } from 'src/libs/entities/warehouse.entity';
import { CreateExportInput } from 'src/types/graphql';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { WarehouseService } from '../warehouse/warehouse.service';

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(ExportEntity)
    private readonly exportRepository: Repository<ExportEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepository: Repository<WarehouseEntity>,
    private readonly warehouseService: WarehouseService,
    private readonly productService: ProductService,
  ) {}

  public async createExport(createExportInput: CreateExportInput) {
    const { productId, exportToWarehouseId } = createExportInput;

    // Check if product exists
    const product: ProductEntity = await this.productService.findProductById(
      productId,
    );

    // Check if exportFromWarehouse exists
    const exportFromWarehouse: WarehouseEntity =
      await this.warehouseService.findWarehouseById(product.warehouseId);

    // Check if exportToWarehouse exists
    const exportToWarehouse: WarehouseEntity =
      await this.warehouseService.findWarehouseById(exportToWarehouseId);

    // Check if exportFromWarehouse and exportToWarehouse are different
    if (product.warehouseId === exportToWarehouseId) {
      throw new ConflictException(
        `Export from same warehouse "${exportFromWarehouse.name}" to warehouse "${exportToWarehouse.name}" is not allowed`,
      );
    }

    // Check if exportToWarehouse has enough space
    if (
      exportToWarehouse.stockCurrentCapacity + product.productSize >
      exportToWarehouse.stockMaxCapacity
    ) {
      throw new ConflictException(
        `Warehouse "${exportToWarehouse.name}" does not have enough space for this product`,
      );
    }

    const newExport = this.exportRepository.create(createExportInput);
    await this.exportRepository.save(newExport);
    return newExport;
  }

  public async findExportById(id: string) {
    const exportFound = await this.getExport(id);
    if (!exportFound) {
      throw new NotFoundException(`Export with id - "${id}" not found`);
    }
    return exportFound;
  }

  public async updateExport(id: string, updateExportInput: CreateExportInput) {
    const exportToUpdate = await this.getExport(id);

    if (!exportToUpdate) {
      throw new NotFoundException(`Export with id - "${id}" not found`);
    }

    Object.assign(exportToUpdate, updateExportInput);

    // Save the updated entity
    const updatedWarehouse = await this.exportRepository.save(exportToUpdate);

    return updatedWarehouse;
  }

  public async deleteExport(id: string) {
    const exportToDelete = await this.getExport(id);

    if (!exportToDelete) {
      throw new NotFoundException(`Export with id - "${id}" not found`);
    }

    await this.exportRepository.delete(id);
    return exportToDelete;
  }

  public async getExports() {
    const allExports = await this.exportRepository.find();
    if (allExports.length === 0) {
      throw new NotFoundException('No exports found');
    }
    return allExports;
  }

  public async getExport(id: string) {
    const exportFound = await this.exportRepository.findOneBy({ id });
    if (!exportFound) {
      throw new NotFoundException(`Export with id - "${id}" not found`);
    }
    return exportFound;
  }
}
