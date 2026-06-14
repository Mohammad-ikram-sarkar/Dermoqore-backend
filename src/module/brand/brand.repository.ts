import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.brand.findMany({
      include: { products: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.brand.findUnique({
      where: { id },
      include: { products: true },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.brand.findUnique({
      where: { slug },
      include: { products: true },
    });
  }

  async create(dto: CreateBrandDto) {
    return this.prisma.brand.create({
      data: {
        name: dto.name,
        slug: dto.slug ?? dto.name.toLowerCase().replace(/\s+/g, '-'),
        logo: dto.logo,
      },
      include: { products: true },
    });
  }

  async update(id: string, dto: UpdateBrandDto) {
    return this.prisma.brand.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.slug !== undefined && { slug: dto.slug }),
        ...(dto.logo !== undefined && { logo: dto.logo }),
      },
      include: { products: true },
    });
  }

  async remove(id: string) {
    await this.prisma.brand.delete({ where: { id } });
  }
}
