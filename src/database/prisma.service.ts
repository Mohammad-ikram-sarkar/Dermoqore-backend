import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import type { PrismaClient } from '../@generated/prisma/client.js';
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

  get category() {
    return this._prisma.category;
  }

  get companyInfo() {
    return this._prisma.companyInfo;
  }

  get footer() {
    return this._prisma.footer;
  }

  get banner() {
    return this._prisma.banner;
  }

  get client() {
    return this._prisma.client;
  }

  get brand() {
    return this._prisma.brand;
  }

  get product() {
    return this._prisma.product;
  }

  get productImage() {
    return this._prisma.productImage;
  }

  get ingredient() {
    return this._prisma.ingredient;
  }

  get productUsage() {
    return this._prisma.productUsage;
  }

  get productBenefit() {
    return this._prisma.productBenefit;
  }

  get productSEO() {
    return this._prisma.productSEO;
  }

  get blog() {
    return this._prisma.blog;
  }

  get deliveryCharge() {
    return this._prisma.deliveryCharge;
  }

  get announcementBar() {
    return this._prisma.announcementBar;
  }

  get address() {
    return this._prisma.address;
  }

  get order() {
    return this._prisma.order;
  }

  get orderItem() {
    return this._prisma.orderItem;
  }

  get campaign() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._prisma.campaign as any;
  }

  get campaignImage() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._prisma.campaignImage as any;
  }

  get campaignOrder() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._prisma.campaignOrder as any;
  }

  get client_() {
    return this._prisma;
  }
}
