import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { CardRepository, ColumnRepository, BoardRepository } from '@app/database';

@Module({
  providers: [
    CardsService,
    CardRepository,
    ColumnRepository,
    BoardRepository,
  ],
  controllers: [CardsController],
  exports: [CardsService],
})
export class CardsModule {}
