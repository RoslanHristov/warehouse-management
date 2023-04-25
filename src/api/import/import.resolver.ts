import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { ImportService } from './import.service';
import { CreateImportInput } from 'src/types/graphql';

@Resolver('Import')
export class ImportResolver {
  constructor(private readonly importService: ImportService) {}

  @Mutation('createImport')
  public async createImport(
    @Args('CreateImportInput') createImportInput: CreateImportInput,
  ) {
    return this.importService.createImport(createImportInput);
  }

  @Mutation('updateImport')
  public async updateImport(
    @Args('id') id: string,
    @Args('UpdateImportInput') updateImportInput,
  ) {
    return this.importService.updateImport(id, updateImportInput);
  }

  @Mutation('deleteImport')
  public async deleteImport(@Args('id') id: string) {
    return this.importService.deleteImport(id);
  }

  @Query()
  public async getImports() {
    return this.importService.getImports();
  }

  @Query()
  public async getImport(@Args('id') id: string) {
    return this.importService.getImport(id);
  }
}
