import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('columns')
export class ColumnsController {
  constructor(private columnsService: ColumnsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllByBoard(
    @Query('boardId') boardId: string,
    @Request() req: { user: { id: string } },
  ) {
    if (!boardId) {
      return [];
    }
    return this.columnsService.findAllByBoard(boardId, req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.columnsService.findById(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() body: { boardId: string; name: string; position?: number },
    @Request() req: { user: { id: string } },
  ) {
    return this.columnsService.create(body.boardId, req.user.id, body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
    @Body() body: { name?: string; position?: number },
  ) {
    return this.columnsService.update(id, req.user.id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    const result = await this.columnsService.delete(id, req.user.id);
    return { success: result };
  }
}
