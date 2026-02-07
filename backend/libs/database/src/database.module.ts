import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { UserRepository } from './repositories/user.repository';
import { BoardRepository } from './repositories/board.repository';
import { ColumnRepository } from './repositories/column.repository';
import { CardRepository } from './repositories/card.repository';

@Global()
@Module({
  providers: [
    DatabaseService,
    UserRepository,
    BoardRepository,
    ColumnRepository,
    CardRepository,
  ],
  exports: [
    DatabaseService,
    UserRepository,
    BoardRepository,
    ColumnRepository,
    CardRepository,
  ],
})
export class DatabaseModule { }
