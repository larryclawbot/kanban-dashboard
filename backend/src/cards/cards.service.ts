import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { BoardRepository, ColumnRepository, CardRepository, Card, InsertCard, Column, Board } from '@app/database';

@Injectable()
export class CardsService {
  constructor(
    private cardRepository: CardRepository,
    private columnRepository: ColumnRepository,
    private boardRepository: BoardRepository,
  ) {}

  async findAllByColumn(columnId: string, userId: string): Promise<Card[]> {
    await this.checkColumnOwnership(columnId, userId);
    return this.cardRepository.findAllByColumn(columnId);
  }

  async findById(id: string, userId: string): Promise<Card> {
    const card = await this.cardRepository.findById(id);
    if (!card) {
      throw new NotFoundException('Card not found');
    }
    await this.checkColumnOwnership(card.columnId, userId);
    return card;
  }

  async create(columnId: string, userId: string, data: { title: string; description?: string; position?: number; dueDate?: Date }): Promise<Card> {
    await this.checkColumnOwnership(columnId, userId);
    const insertCard: InsertCard = {
      title: data.title,
      description: data.description,
      position: data.position ?? 0,
      columnId,
      dueDate: data.dueDate,
    };
    return this.cardRepository.create(insertCard);
  }

  async update(id: string, userId: string, data: { title?: string; description?: string; position?: number; dueDate?: Date }): Promise<Card> {
    await this.findById(id, userId);
    const updated = await this.cardRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException('Card not found');
    }
    return updated;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    await this.findById(id, userId);
    return this.cardRepository.delete(id);
  }

  async move(id: string, userId: string, data: { columnId?: string; position?: number }): Promise<Card> {
    const card = await this.findById(id, userId);
    
    // If moving to a different column, check ownership of that column too
    if (data.columnId && data.columnId !== card.columnId) {
      await this.checkColumnOwnership(data.columnId, userId);
    }
    
    const updateData: Partial<InsertCard> = {};
    if (data.columnId !== undefined) {
      updateData.columnId = data.columnId;
    }
    if (data.position !== undefined) {
      updateData.position = data.position;
    }
    
    const updated = await this.cardRepository.update(id, updateData);
    if (!updated) {
      throw new NotFoundException('Card not found');
    }
    return updated;
  }

  private async checkColumnOwnership(columnId: string, userId: string): Promise<void> {
    const column = await this.columnRepository.findById(columnId);
    if (!column) {
      throw new NotFoundException('Column not found');
    }
    await this.checkBoardOwnership(column.boardId, userId);
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
