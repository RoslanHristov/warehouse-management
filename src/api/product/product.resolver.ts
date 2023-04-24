import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { CreateProductInput, UpdateProductInput } from 'src/types/graphql';

@Resolver('Product')
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation('createProduct')
  public async createProduct(
    @Args('CreateProductInput') createWarehouseInput: CreateProductInput,
  ) {
    return this.productService.createProduct(createWarehouseInput);
  }

  @Mutation('deleteProduct')
  public async deleteProduct(@Args('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  @Mutation('updateProduct')
  public async updateProduct(
    @Args('UpdateProductInput') updateProductInput: UpdateProductInput,
  ) {
    return this.productService.updateProduct(updateProductInput);
  }

  @Query('findAllProducts')
  public async findAllProducts() {
    return this.productService.findAllProducts();
  }

  @Query('findProductById')
  public async findProductById(@Args('id') id: string) {
    return this.productService.findProductById(id);
  }
}
