import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogQueryDto } from './dto/blog-query.dto';
import { BlogStatus } from '../../@generated/prisma/enums';
import { Prisma } from '../../@generated/prisma/client';

@Injectable()
export class BlogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: BlogQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      authorId,
      status,
      sort = 'newest',
      featured,
    } = query;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { path: '$', string_contains: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (authorId) {
      where.authorId = authorId;
    }

    if (status) {
      where.status = status;
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    const orderBy = this.buildOrderBy(sort);

    const [blogs, total] = await Promise.all([
      this.prisma.blog.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, name: true, email: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.blog.count({ where }),
    ]);

    return {
      data: blogs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findPublished(query: BlogQueryDto) {
    return this.findAll({ ...query, status: BlogStatus.PUBLISHED });
  }

  async findById(id: string) {
    return this.prisma.blog.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.blog.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async create(dto: CreateBlogDto, authorId: string) {
    const slug = dto.slug ?? dto.title.toLowerCase().replace(/\s+/g, '-');

    const existing = await this.prisma.blog.findUnique({ where: { slug } });
    if (existing) {
      const uniqueSlug = `${slug}-${Date.now()}`;
      return this.prisma.blog.create({
        data: { ...dto, slug: uniqueSlug, authorId },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, name: true, email: true } },
        },
      });
    }

    return this.prisma.blog.create({
      data: { ...dto, slug, authorId },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async update(id: string, dto: UpdateBlogDto) {
    const data: any = { ...dto };

    if (dto.title && !dto.slug) {
      data.slug = dto.title.toLowerCase().replace(/\s+/g, '-');
    }

    if (dto.slug) {
      const existing = await this.prisma.blog.findUnique({
        where: { slug: dto.slug },
      });
      if (existing && existing.id !== id) {
        data.slug = `${dto.slug}-${Date.now()}`;
      }
    }

    return this.prisma.blog.update({
      where: { id },
      data,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async remove(id: string) {
    await this.prisma.blog.delete({ where: { id } });
  }

  async updateImage(id: string, imageUrl: string) {
    return this.prisma.blog.update({
      where: { id },
      data: { featuredImage: imageUrl },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findFeatured(limit = 5) {
    return this.prisma.blog.findMany({
      where: { featured: true, status: BlogStatus.PUBLISHED },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findRelated(blogId: string, categoryId: string, limit = 3) {
    return this.prisma.blog.findMany({
      where: {
        id: { not: blogId },
        categoryId,
        status: BlogStatus.PUBLISHED,
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  private buildOrderBy(sort: string): Prisma.BlogOrderByWithRelationInput {
    switch (sort) {
      case 'titleAsc':
        return { title: 'asc' };
      case 'titleDesc':
        return { title: 'desc' };
      case 'oldest':
        return { createdAt: 'asc' };
      case 'newest':
      default:
        return { createdAt: 'desc' };
    }
  }

  async findOne(id: string) {
    return this.findById(id);
  }

  async checkCategoryExists(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    return !!category;
  }
}
