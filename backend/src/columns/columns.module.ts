import { Module } from '@nestjs/common';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';
import { ColumnRepository, BoardRepository } from '@app/database';

@Module({
  providers: [
    ColumnsService,
    ColumnRepository,
    BoardRepository,
  ],
  controllers: [ColumnsController],
  exports: [ColumnsService],
})
export class ColumnsModule {}
