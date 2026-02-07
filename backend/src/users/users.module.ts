import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from '@app/database';

@Module({
  providers: [
    UsersService,
    UserRepository,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule { }
