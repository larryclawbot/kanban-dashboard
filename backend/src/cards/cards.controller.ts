import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { CardsService } from './cards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllByColumn(
    @Query('columnId') columnId: string,
    @Request() req: { user: { id: string } },
  ) {
    if (!columnId) {
      return [];
    }
    return this.cardsService.findAllByColumn(columnId, req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.cardsService.findById(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() body: { columnId: string; title: string; description?: string; position?: number; dueDate?: Date },
    @Request() req: { user: { id: string } },
  ) {
    return this.cardsService.create(body.columnId, req.user.id, body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
    @Body() body: { title?: string; description?: string; position?: number; dueDate?: Date },
  ) {
    return this.cardsService.update(id, req.user.id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    const result = await this.cardsService.delete(id, req.user.id);
    return { success: result };
  }

  @Put(':id/move')
  @UseGuards(JwtAuthGuard)
  async move(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
    @Body() body: { columnId?: string; position?: number },
  ) {
    return this.cardsService.move(id, req.user.id, body);
  }
}
