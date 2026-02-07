import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { CardsService } from './cards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllByColumn(@Query('columnId') columnId: string) {
    if (!columnId) {
      return [];
    }
    return this.cardsService.findAllByColumn(columnId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    const card = await this.cardsService.findById(id);
    if (!card) {
      throw new Error('Card not found');
    }
    return card;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() body: { columnId: string; title: string; description?: string; position?: number; dueDate?: Date },
  ) {
    return this.cardsService.create(body.columnId, body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string; position?: number; dueDate?: Date },
  ) {
    return this.cardsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    const result = await this.cardsService.delete(id);
    return { success: result };
  }
}
