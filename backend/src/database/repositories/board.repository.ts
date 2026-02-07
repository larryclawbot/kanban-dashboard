import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { boards, Board, InsertBoard } from '../schema';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class BoardRepository {
  constructor(private db: DatabaseService) {}

  async findAllByUser(userId: string): Promise<Board[]> {
    return this.db.db.query.boards.findMany({
      where: (boards, { eq }) => eq(boards.userId, userId),
      orderBy: (boards, { desc }) => [desc(boards.createdAt)],
    });
  }

  async findById(id: string): Promise<Board | undefined> {
    return this.db.db.query.boards.findFirst({
      where: (boards, { eq }) => eq(boards.id, id),
    });
  }

  async create(data: InsertBoard): Promise<Board> {
    const [board] = await this.db.db.insert(boards).values(data).returning();
    return board;
  }

  async update(id: string, data: Partial<InsertBoard>): Promise<Board | undefined> {
    const [board] = await this.db.db
      .update(boards)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(boards.id, id))
      .returning();
    return board;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.db.delete(boards).where(eq(boards.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
