import { Injectable } from '@nestjs/common';
import { ColumnRepository, Column, InsertColumn } from '@app/database';

@Injectable()
export class ColumnsService {
  constructor(
    private columnRepository: ColumnRepository,
  ) {}

  async findAllByBoard(boardId: string): Promise<Column[]> {
    return this.columnRepository.findAllByBoard(boardId);
  }

  async findById(id: string): Promise<Column | null> {
    const column = await this.columnRepository.findById(id);
    return column ?? null;
  }

  async create(boardId: string, data: { name: string; position?: number }): Promise<Column> {
    const insertColumn: InsertColumn = {
      name: data.name,
      position: data.position ?? 0,
      boardId,
    };
    return this.columnRepository.create(insertColumn);
  }

  async update(id: string, data: { name?: string; position?: number }): Promise<Column | null> {
    const column = await this.columnRepository.update(id, data);
    return column ?? null;
  }

  async delete(id: string): Promise<boolean> {
    return this.columnRepository.delete(id);
  }
}
