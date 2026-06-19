import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateFooterDto } from './dto/create-footer.dto';
import { UpdateFooterDto } from './dto/update-footer.dto';

@Injectable()
export class FooterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.footer.findMany({
      include: {
        socialLinks: true,
        sections: { include: { links: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.footer.findUnique({
      where: { id },
      include: {
        socialLinks: true,
        sections: {
          include: { links: true },
          orderBy: { id: 'asc' },
        },
      },
    });
  }

  async create(dto: CreateFooterDto) {
    return this.prisma.footer.create({
      data: {
        logo: dto.logo,
        description: dto.description,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
        copyright: dto.copyright,
        socialLinks: dto.socialLinks ? { create: dto.socialLinks } : undefined,
        sections: dto.sections
          ? {
              create: dto.sections.map((section) => ({
                title: section.title,
                links: section.links ? { create: section.links } : undefined,
              })),
            }
          : undefined,
      },
      include: {
        socialLinks: true,
        sections: { include: { links: true } },
      },
    });
  }

  async update(id: string, dto: UpdateFooterDto) {
    const { socialLinks, sections, ...rest } = dto;

    await this.prisma.footer.update({
      where: { id },
      data: {
        ...rest,
        socialLinks: socialLinks
          ? {
              deleteMany: {},
              create: socialLinks.map((s) => ({
                name: s.name ?? '',
                icon: s.icon,
                url: s.url ?? '',
              })),
            }
          : undefined,
        sections: sections
          ? {
              deleteMany: {},
              create: sections.map((section) => ({
                title: section.title ?? '',
                links: section.links
                  ? {
                      create: section.links.map((l) => ({
                        label: l.label ?? '',
                        href: l.href ?? '',
                      })),
                    }
                  : undefined,
              })),
            }
          : undefined,
      },
    });

    return this.findById(id);
  }

  async remove(id: string) {
    await this.prisma.footer.delete({ where: { id } });
  }

  async updateLogo(id: string, logo: string) {
    return this.prisma.footer.update({
      where: { id },
      data: { logo },
      include: {
        socialLinks: true,
        sections: { include: { links: true } },
      },
    });
  }
}
