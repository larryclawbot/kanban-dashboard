import { Injectable, ConflictException } from '@nestjs/common';

import { User, InsertUser } from '../../libs/database/src/schema';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '@app/database';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
  ) { }

  async findOne(id: string): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    return user ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    return user ?? null;
  }

  async create(userData: { email: string; password: string; name: string }): Promise<User> {
    const existing = await this.findByEmail(userData.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const insertUser: InsertUser = {
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
    };

    return this.userRepository.create(insertUser);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
