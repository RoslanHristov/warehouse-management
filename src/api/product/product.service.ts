import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/libs/entities/product.entity';
import { WarehouseEntity } from 'src/libs/entities/warehouse.entity';
import { CreateProductInput } from 'src/types/graphql';
import { Repository } from 'typeorm';
import { WarehouseService } from '../warehouse/warehouse.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(WarehouseEntity)
    private readonly warehouseRepository: Repository<WarehouseEntity>,
    private readonly warehouseService: WarehouseService,
  ) {}

  public async createProduct(createProductInput: CreateProductInput) {
    try {
      const { warehouseId, isHazardous, productSize } = createProductInput;

      const warehouse = await this.warehouseService.findWarehouseById(
        warehouseId,
      );

      if (warehouse.hazardous !== isHazardous) {
        throw new ConflictException(
          `Warehouse "${warehouse.name}" does not accept hazardous products`,
        );
      }

      if (
        warehouse.stockCurrentCapacity + productSize >
        warehouse.stockMaxCapacity
      ) {
        throw new ConflictException(
          `Warehouse with "${warehouse.name}" does not have enough space for this product`,
        );
      }

      const newProduct = this.productRepository.create(createProductInput);
      await this.productRepository.save(newProduct);

      // Update warehouse stock capacity
      const newWarehouseCurrentCapacity =
        warehouse.stockCurrentCapacity + productSize;
      await this.warehouseRepository.update(warehouse.id, {
        stockCurrentCapacity: newWarehouseCurrentCapacity,
      });

      return newProduct;
    } catch (error) {
      if (error.code === '23505') {
        // Postgres unique constraint violation error code
        throw new ConflictException(
          `Product with name "${createProductInput.name}" already exists`,
        );
      }
      throw error;
    }
  }

  /**
   * Updates product based on provided arguments.
   * Handles moving the product to a new warehouse if a new warehouseId is provided.
   * Also checks if the product is moved to a warehouse that accepts hazardous/non-hazardous products,
   * checks if the warehouse has enough space for the product, updates the new/old warehouse stock capacity.
   * @param updateProductInput
   * @returns
   */
  public async updateProduct(updateProductInput) {
    const id: string = updateProductInput.id;
    const { warehouseId, productSize, name } = updateProductInput;
    try {
      const currentProduct: ProductEntity = await this.findProductById(id);

      if (
        warehouseId !== undefined &&
        warehouseId !== currentProduct.warehouseId
      ) {
        // Find the new warehouse where the product will be moved
        const warehouse = await this.warehouseService.findWarehouseById(
          warehouseId,
        );

        // Check if the new warehouse accepts hazardous/non-hazardous products
        // TODO: Pick better property names, bad naming hazardous vs isHazardous :)
        if (warehouse.hazardous !== currentProduct.isHazardous) {
          throw new ConflictException(
            `Warehouse "${warehouse.name}" accepts only ${
              warehouse.hazardous ? 'hazardous' : 'non-hazardous'
            } products`,
          );
        }

        if (
          warehouse.stockCurrentCapacity +
            (productSize !== undefined
              ? productSize
              : currentProduct.productSize) >
          warehouse.stockMaxCapacity
        ) {
          throw new ConflictException(
            `Warehouse "${
              warehouse.name
            }" does not have enough space for this product. Current free capacity is: ${
              warehouse.stockMaxCapacity - warehouse.stockCurrentCapacity
            } and product size is: ${
              productSize !== undefined
                ? productSize
                : currentProduct.productSize
            }`,
          );
        }

        // Update new warehouse capacity where product is moved (add product size to current capacity)
        const newWarehouseCurrentCapacity =
          warehouse.stockCurrentCapacity +
          (productSize !== undefined
            ? productSize
            : currentProduct.productSize);

        await this.warehouseRepository.update(warehouse.id, {
          stockCurrentCapacity: newWarehouseCurrentCapacity,
        });

        // Update the stock capacity for the old warehouse (remove product size from current capacity)
        const oldWarehouse = await this.warehouseService.findWarehouseById(
          currentProduct.warehouseId,
        );

        const oldWarehouseUpdatedCurrentCapacity =
          oldWarehouse.stockCurrentCapacity -
          (productSize !== undefined
            ? currentProduct.productSize
            : currentProduct.productSize);

        await this.warehouseRepository.update(
          { id: currentProduct.warehouseId },
          {
            stockCurrentCapacity:
              oldWarehouseUpdatedCurrentCapacity < 0 // If the capacity becomes less than 0 after the product update, set it to 0
                ? 0
                : oldWarehouseUpdatedCurrentCapacity,
          },
        );
      } else {
        // If stock is not moved to a new warehouse, just update the stock capacity for the current warehouse.
        // Remove product size from current capacity
        const warehouse = await this.warehouseService.findWarehouseById(
          currentProduct.warehouseId,
        );

        // Check if the updated product capacity will fit in the warehouse
        if (productSize > warehouse.stockMaxCapacity) {
          throw new ConflictException(
            `Warehouse "${
              warehouse.name
            }" does not have enough space for this product. Current free capacity is: ${
              warehouse.stockMaxCapacity - warehouse.stockCurrentCapacity
            } and product new size is: ${
              productSize !== undefined
                ? productSize
                : currentProduct.productSize
            }`,
          );
        }

        // First we subtracts the size of the product that is currently in the warehouse from the current stock capacity.
        // Then we add the size of the new product to the stock capacity, taking into account whether the size of the new product is defined or not.
        const currentWarehouseCapacity =
          warehouse.stockCurrentCapacity -
          (productSize !== undefined
            ? currentProduct.productSize
            : currentProduct.productSize) +
          (productSize !== undefined
            ? productSize
            : currentProduct.productSize);

        await this.warehouseRepository.update(warehouse.id, {
          stockCurrentCapacity: currentWarehouseCapacity,
        });
      }

      // Update the entity properties
      Object.assign(currentProduct, updateProductInput);
      const updatedProduct: ProductEntity = await this.productRepository.save(
        currentProduct,
      );

      return updatedProduct;
    } catch (error) {
      if (error.code === '23505') {
        // Postgres unique constraint violation error code
        throw new ConflictException(
          `Product with name "${name}" already exists`,
        );
      }
      throw error;
    }
  }

  public async findAllProducts() {
    const allProducts = await this.productRepository.find();
    if (allProducts.length === 0) {
      throw new ConflictException('No products found');
    }
    return allProducts;
  }

  public async deleteProduct(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new ConflictException('Cannot find product with the provided id');
    }

    // Update warehouse stock capacity (remove product size from current capacity)
    const warehouse = await this.warehouseService.findWarehouseById(
      product.warehouseId,
    );
    const newWarehouseCurrentCapacity =
      warehouse.stockCurrentCapacity - product.productSize;
    await this.warehouseRepository.update(warehouse.id, {
      stockCurrentCapacity: newWarehouseCurrentCapacity,
    });

    await this.productRepository.delete(id);
    return `Product ${product.name} deleted successfully`;
  }

  public async findProductById(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new ConflictException('Cannot find product with the provided id');
    }
    return product;
  }
}
