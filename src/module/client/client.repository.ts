import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.client.findMany({
      include: { _count: { select: { banners: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.client.findUnique({
      where: { id },
      include: {
        banners: { orderBy: { updatedAt: 'desc' } },
        _count: { select: { banners: true } },
      },
    });
  }

  async create(dto: CreateClientDto) {
    return this.prisma.client.create({
      data: {
        name: dto.name,
        segment: dto.segment,
        status: dto.status ?? 'Active',
        avatar: dto.avatar,
        color: dto.color,
      },
    });
  }

  async update(id: string, dto: UpdateClientDto) {
    await this.prisma.client.update({
      where: { id },
      data: {
        name: dto.name,
        segment: dto.segment,
        status: dto.status,
        avatar: dto.avatar,
        color: dto.color,
      },
    });
    return this.findById(id);
  }

  async remove(id: string) {
    await this.prisma.client.delete({ where: { id } });
  }
}
