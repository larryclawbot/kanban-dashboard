import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BoardRepository, ColumnRepository, Column, InsertColumn, Board } from '@app/database';

@Injectable()
export class ColumnsService {
  constructor(
    private columnRepository: ColumnRepository,
    private boardRepository: BoardRepository,
  ) {}

  async findAllByBoard(boardId: string, userId: string): Promise<Column[]> {
    await this.checkBoardOwnership(boardId, userId);
    return this.columnRepository.findAllByBoard(boardId);
  }

  async findById(id: string, userId: string): Promise<Column> {
    const column = await this.columnRepository.findById(id);
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    await this.checkBoardOwnership(column.boardId, userId);
    return column;
  }

  async create(boardId: string, userId: string, data: { name: string; position?: number }): Promise<Column> {
    await this.checkBoardOwnership(boardId, userId);
    const insertColumn: InsertColumn = {
      name: data.name,
      position: data.position ?? 0,
      boardId,
    };
    return this.columnRepository.create(insertColumn);
  }

  async update(id: string, userId: string, data: { name?: string; position?: number }): Promise<Column> {
    const column = await this.findById(id, userId);
    const updated = await this.columnRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException('Column not found');
    }
    return updated;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    await this.findById(id, userId);
    return this.columnRepository.delete(id);
  }

  private async checkBoardOwnership(boardId: string, userId: string): Promise<void> {
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    if (board.userId !== userId) {
      throw new ForbiddenException('You do not have access to this board');
    }
  }
}
