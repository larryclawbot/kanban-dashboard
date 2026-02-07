import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  async findByIdWithOwnerCheck(id: string, userId: string): Promise<Board> {
    const board = await this.boardRepository.findById(id);
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    if (board.userId !== userId) {
      throw new ForbiddenException('You do not have access to this board');
    }
    return board;
  }

  async create(userId: string, data: { name: string; description?: string }): Promise<Board> {
    const insertBoard: InsertBoard = {
      name: data.name,
      description: data.description,
      userId,
    };
    return this.boardRepository.create(insertBoard);
  }

  async update(id: string, userId: string, data: { name?: string; description?: string }): Promise<Board> {
    const board = await this.findByIdWithOwnerCheck(id, userId);
    const updated = await this.boardRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException('Board not found');
    }
    return updated;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    await this.findByIdWithOwnerCheck(id, userId);
    return this.boardRepository.delete(id);
  }
}
