import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.banner.findMany({
      include: { client: true, category: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.banner.findUnique({
      where: { id },
      include: { client: true, category: true },
    });
  }

  async findByClientId(clientId: string) {
    return this.prisma.banner.findMany({
      where: { clientId },
      include: { client: true, category: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async create(dto: CreateBannerDto) {
    return this.prisma.banner.create({
      data: {
        title: dto.title,
        tag: dto.tag,
        description: dto.description,
        imageType: dto.imageType,
        device: dto.device ?? 'desktop',
        imageUrl: dto.imageUrl,
        status: dto.status ?? 'Draft',
        isActive: dto.isActive ?? true,
        clientId: dto.clientId,
        categoryId: dto.categoryId ?? null,
      },
      include: { client: true, category: true },
    });
  }

  async update(id: string, dto: UpdateBannerDto) {
    await this.prisma.banner.update({
      where: { id },
      data: {
        title: dto.title,
        tag: dto.tag,
        description: dto.description,
        imageType: dto.imageType,
        device: dto.device,
        imageUrl: dto.imageUrl,
        status: dto.status,
        isActive: dto.isActive,
        clientId: dto.clientId,
        categoryId: dto.categoryId,
      },
    });
    return this.findById(id);
  }

  async remove(id: string) {
    await this.prisma.banner.delete({ where: { id } });
  }

  async updateImage(id: string, imageUrl: string) {
    return this.prisma.banner.update({
      where: { id },
      data: { imageUrl },
      include: { client: true, category: true },
    });
  }
}
