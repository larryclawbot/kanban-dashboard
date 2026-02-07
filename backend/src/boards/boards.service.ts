import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardRepository, Board, InsertBoard } from '@app/database';

@Injectable()
export class BoardsService {
  constructor(
    private boardRepository: BoardRepository,
  ) {}

  async findAllByUser(userId: string): Promise<Board[]> {
    return this.boardRepository.findAllByUser(userId);
  }

  async findById(id: string): Promise<Board | null> {
    const board = await this.boardRepository.findById(id);
    return board ?? null;
  }

  async create(userId: string, data: { name: string; description?: string }): Promise<Board> {
    const insertBoard: InsertBoard = {
      name: data.name,
      description: data.description,
      userId,
    };
    return this.boardRepository.create(insertBoard);
  }

  async update(id: string, data: { name?: string; description?: string }): Promise<Board | null> {
    const board = await this.boardRepository.update(id, data);
    return board ?? null;
  }

  async delete(id: string): Promise<boolean> {
    return this.boardRepository.delete(id);
  }
}
