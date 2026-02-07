import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { columns, Column, InsertColumn } from '../schema';
import { eq, asc } from 'drizzle-orm';

@Injectable()
export class ColumnRepository {
  constructor(private db: DatabaseService) {}

  async findAllByBoard(boardId: string): Promise<Column[]> {
    return this.db.db.query.columns.findMany({
      where: (columns, { eq }) => eq(columns.boardId, boardId),
      orderBy: (columns, { asc }) => [asc(columns.position)],
    });
  }

  async findById(id: string): Promise<Column | undefined> {
    return this.db.db.query.columns.findFirst({
      where: (columns, { eq }) => eq(columns.id, id),
    });
  }

  async create(data: InsertColumn): Promise<Column> {
    const [column] = await this.db.db.insert(columns).values(data).returning();
    return column;
  }

  async update(id: string, data: Partial<InsertColumn>): Promise<Column | undefined> {
    const [column] = await this.db.db
      .update(columns)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(columns.id, id))
      .returning();
    return column;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.db.delete(columns).where(eq(columns.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
