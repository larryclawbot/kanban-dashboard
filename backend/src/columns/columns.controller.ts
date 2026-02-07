import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('columns')
export class ColumnsController {
  constructor(private columnsService: ColumnsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllByBoard(@Query('boardId') boardId: string) {
    if (!boardId) {
      return [];
    }
    return this.columnsService.findAllByBoard(boardId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    const column = await this.columnsService.findById(id);
    if (!column) {
      throw new Error('Column not found');
    }
    return column;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() body: { boardId: string; name: string; position?: number },
  ) {
    return this.columnsService.create(body.boardId, body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; position?: number },
  ) {
    return this.columnsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    const result = await this.columnsService.delete(id);
    return { success: result };
  }
}
