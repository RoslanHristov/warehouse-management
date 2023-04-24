import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { ExportService } from './export.service';
import { CreateExportInput } from 'src/types/graphql';

@Resolver('Export')
export class ExportResolver {
  constructor(private readonly exportService: ExportService) {}

  @Mutation('createExport')
  public async createExport(
    @Args('CreateExportInput') createExportInput: CreateExportInput,
  ) {
    return this.exportService.createExport(createExportInput);
  }

  @Mutation('updateExport')
  public async updateExport(
    @Args('id') id: string,
    @Args('UpdateExportInput') updateExportInput,
  ) {
    return this.exportService.updateExport(id, updateExportInput);
  }

  @Mutation('deleteExport')
  public async deleteExport(@Args('id') id: string) {
    return this.exportService.deleteExport(id);
  }
}
