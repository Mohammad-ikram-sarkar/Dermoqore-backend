import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../@generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

let PrismaClientClass: typeof PrismaClient | null = null;

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private _prisma!: PrismaClient;

  async onModuleInit() {
    if (!PrismaClientClass) {
      const mod = await import('../@generated/prisma/client.js');
      PrismaClientClass = mod.PrismaClient;
    }

    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);

    this._prisma = new PrismaClientClass({ adapter });
    await this._prisma.$connect();
  }

  async onModuleDestroy() {
    if (this._prisma) {
      await this._prisma.$disconnect();
    }
  }

  get user() {
    return this._prisma.user;
  }
}
