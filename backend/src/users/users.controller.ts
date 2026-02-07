import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '@app/database';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: { user: { id: string } }) {
    const user = await this.usersService.findOne(req.user.id);
    if (!user) {
      throw new Error('User not found');
    }
    // Don't return password
    const { password, ...result } = user;
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    // Don't return password
    const { password, ...result } = user;
    return result as User;
  }
}
