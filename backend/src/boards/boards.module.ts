import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { BoardRepository } from '@app/database';

@Module({
  providers: [
    BoardsService,
    BoardRepository,
  ],
  controllers: [BoardsController],
  exports: [BoardsService],
})
export class BoardsModule {}
