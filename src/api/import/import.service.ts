import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/libs/entities/product.entity';
import { WarehouseEntity } from 'src/libs/entities/warehouse.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { WarehouseService } from '../warehouse/warehouse.service';
import { CreateImportInput, UpdateImportInput } from 'src/types/graphql';
import { ImportEntity } from 'src/libs/entities/import.entity';

@Injectable()
export class ImportService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepository: Repository<ProductEntity>,
    @InjectRepository(ImportEntity)
    private readonly importRepository: Repository<ImportEntity>,

    private readonly warehouseService: WarehouseService,
    private readonly productService: ProductService,
  ) {}

  public async createImport(createImportInput: CreateImportInput) {
    const { productId, importToWarehouseId } = createImportInput;

    // Check if product exists
    const product: ProductEntity = await this.productService.findProductById(
      productId,
    );

    // Check if product warehouse exists
    const importFromWarehouse: WarehouseEntity =
      await this.warehouseService.findWarehouseById(product.warehouseId);

    // Check if warehouse that we're importing to exists
    const importToWarehouse: WarehouseEntity =
      await this.warehouseService.findWarehouseById(importToWarehouseId);

    if (product.warehouseId === importToWarehouseId) {
      throw new ConflictException(
        `Import from same warehouse "${importFromWarehouse.name}" to warehouse "${importToWarehouse.name}" is not allowed`,
      );
    }

    // Check if imported product is hazordous and warehouse will accept it
    if (product.isHazardous !== importToWarehouse.hazardous) {
      throw new ConflictException(
        `Import to warehouse "${importToWarehouse.name}" accepts only ${
          importToWarehouse.hazardous ? 'hazardous' : 'non-hazardous'
        } products`,
      );
    }

    // Check if importToWarehouse has enough space
    if (
      importToWarehouse.stockCurrentCapacity + product.productSize >
      importToWarehouse.stockMaxCapacity
    ) {
      throw new ConflictException(
        `Warehouse "${importToWarehouse.name}" does not have enough space for this product`,
      );
    }

    const newImport = this.importRepository.create(createImportInput);
    await this.importRepository.save(newImport);

    // Update product warehouseId
    product.warehouseId = importToWarehouseId;
    await this.productRepository.save(product);

    // Update importToWarehouse stockCurrentCapacity
    importToWarehouse.stockCurrentCapacity += product.productSize;
    await this.warehouseRepository.save(importToWarehouse);

    // Update importFromWarehouse stockCurrentCapacity
    importFromWarehouse.stockCurrentCapacity -= product.productSize;
    await this.warehouseRepository.save(importFromWarehouse);

    return newImport;
  }

  public async updateImport(id: string, updateImportInput: UpdateImportInput) {
    const importToUpdate = await this.getImport(id);

    if (!importToUpdate) {
      throw new NotFoundException(`Import with id - "${id}" not found`);
    }

    Object.assign(importToUpdate, updateImportInput);

    // Save the updated entity
    const updatedWarehouse = await this.importRepository.save(importToUpdate);

    return updatedWarehouse;
  }

  public async getImport(id: string) {
    const importToFind = await this.importRepository.findOneBy({ id });

    if (!importToFind) {
      throw new NotFoundException(`Import with id - "${id}" not found`);
    }

    return importToFind;
  }

  public async getImports() {
    const imports = await this.importRepository.find();
    if (imports.length === 0) {
      throw new NotFoundException(`No imports found`);
    }

    return imports;
  }

  public async deleteImport(id: string) {
    const importToDelete = await this.getImport(id);

    if (!importToDelete) {
      throw new NotFoundException(`Import with id - "${id}" not found`);
    }

    await this.importRepository.remove(importToDelete);

    return importToDelete;
  }
}
