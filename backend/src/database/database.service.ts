import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  db: ReturnType<typeof drizzle<typeof schema>>;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://kanban:kanban123@localhost:5432/kanban',
    });
    this.db = drizzle(this.pool, { schema });
  }

  async onModuleInit() {
    console.log('Database connected');
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
