import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllByUser(@Request() req: { user: { id: string } }) {
    return this.boardsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.boardsService.findByIdWithOwnerCheck(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Request() req: { user: { id: string } },
    @Body() body: { name: string; description?: string },
  ) {
    return this.boardsService.create(req.user.id, body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
    @Body() body: { name?: string; description?: string },
  ) {
    return this.boardsService.update(id, req.user.id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    const result = await this.boardsService.delete(id, req.user.id);
    return { success: result };
  }
}
