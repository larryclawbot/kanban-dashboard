import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../../libs/database/src/schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async register(userData: { email: string; password: string; name: string }): Promise<{ user: Partial<User>; access_token: string }> {
    const user = await this.usersService.create(userData);
    const payload = { sub: user.id, email: user.email };

    return {
      user: { id: user.id, email: user.email, name: user.name },
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(email: string, password: string): Promise<{ user: Partial<User>; access_token: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.usersService.validatePassword(user, password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      user: { id: user.id, email: user.email, name: user.name },
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(payload: { sub: string; email: string }): Promise<User | null> {
    return this.usersService.findOne(payload.sub);
  }
}
