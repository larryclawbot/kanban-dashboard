import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { cards, Card, InsertCard } from '../schema';
import { eq, asc } from 'drizzle-orm';

@Injectable()
export class CardRepository {
  constructor(private db: DatabaseService) {}

  async findAllByColumn(columnId: string): Promise<Card[]> {
    return this.db.db.query.cards.findMany({
      where: (cards, { eq }) => eq(cards.columnId, columnId),
      orderBy: (cards, { asc }) => [asc(cards.position)],
    });
  }

  async findById(id: string): Promise<Card | undefined> {
    return this.db.db.query.cards.findFirst({
      where: (cards, { eq }) => eq(cards.id, id),
    });
  }

  async create(data: InsertCard): Promise<Card> {
    const [card] = await this.db.db.insert(cards).values(data).returning();
    return card;
  }

  async update(id: string, data: Partial<InsertCard>): Promise<Card | undefined> {
    const [card] = await this.db.db
      .update(cards)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(cards.id, id))
      .returning();
    return card;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.db.delete(cards).where(eq(cards.id, id));
    return (result.rowCount ?? 0) > 0;
  }
}
