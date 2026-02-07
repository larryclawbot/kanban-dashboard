import { Injectable } from '@nestjs/common';
import { CardRepository, Card, InsertCard } from '@app/database';

@Injectable()
export class CardsService {
  constructor(
    private cardRepository: CardRepository,
  ) {}

  async findAllByColumn(columnId: string): Promise<Card[]> {
    return this.cardRepository.findAllByColumn(columnId);
  }

  async findById(id: string): Promise<Card | null> {
    const card = await this.cardRepository.findById(id);
    return card ?? null;
  }

  async create(columnId: string, data: { title: string; description?: string; position?: number; dueDate?: Date }): Promise<Card> {
    const insertCard: InsertCard = {
      title: data.title,
      description: data.description,
      position: data.position ?? 0,
      columnId,
      dueDate: data.dueDate,
    };
    return this.cardRepository.create(insertCard);
  }

  async update(id: string, data: { title?: string; description?: string; position?: number; dueDate?: Date }): Promise<Card | null> {
    const card = await this.cardRepository.update(id, data);
    return card ?? null;
  }

  async delete(id: string): Promise<boolean> {
    return this.cardRepository.delete(id);
  }
}
