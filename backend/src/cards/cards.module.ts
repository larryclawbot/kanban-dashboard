import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { CardRepository } from '@app/database';

@Module({
  providers: [
    CardsService,
    CardRepository,
  ],
  controllers: [CardsController],
  exports: [CardsService],
})
export class CardsModule {}
