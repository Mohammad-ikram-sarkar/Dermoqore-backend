import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateAnnouncementBarDto } from './dto/create-announcement-bar.dto';
import { UpdateAnnouncementBarDto } from './dto/update-announcement-bar.dto';

@Injectable()
export class AnnouncementBarRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.announcementBar.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findActive() {
    return this.prisma.announcementBar.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.announcementBar.findUnique({
      where: { id },
    });
  }

  async create(dto: CreateAnnouncementBarDto) {
    return this.prisma.announcementBar.create({ data: dto });
  }

  async update(id: string, dto: UpdateAnnouncementBarDto) {
    await this.prisma.announcementBar.update({
      where: { id },
      data: dto,
    });
    return this.findById(id);
  }

  async remove(id: string) {
    await this.prisma.announcementBar.delete({ where: { id } });
  }
}
