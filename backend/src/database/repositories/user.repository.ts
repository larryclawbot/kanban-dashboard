import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { users, User, InsertUser } from '../schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserRepository {
  constructor(private db: DatabaseService) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.db.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.db.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
    });
  }

  async create(data: InsertUser): Promise<User> {
    const [user] = await this.db.db.insert(users).values(data).returning();
    return user;
  }

  async update(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await this.db.db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }
}
