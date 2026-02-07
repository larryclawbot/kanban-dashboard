import { Module } from '@nestjs/common';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { ColumnRepository } from '@app/database';

@Module({
  providers: [
    ColumnsService,
    ColumnRepository,
  ],
  controllers: [ColumnsController],
  exports: [ColumnsService],
})
export class ColumnsModule {}
