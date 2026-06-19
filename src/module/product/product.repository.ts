import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ProductStatus } from '../../@generated/prisma/enums.js';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto, ProductSortDto } from './dto/product-query.dto';

const productInclude = {
  category: true,
  brand: true,
  images: { orderBy: { sortOrder: 'asc' as const } },
  ingredients: true,
  howToUse: { orderBy: { stepNumber: 'asc' as const } },
  benefits: true,
  seo: true,
};

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.product.findMany({
      include: productInclude,
      orderBy: { name: 'asc' },
    });
  }

  async findPaginated(query: ProductQueryDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 12, 48);
    const skip = (page - 1) * limit;
    const where = {
      status: query.status ?? ProductStatus.ACTIVE,
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' as const } },
          {
            shortDescription: {
              contains: query.search,
              mode: 'insensitive' as const,
            },
          },
          {
            skinType: { contains: query.search, mode: 'insensitive' as const },
          },
        ],
      }),
      ...(query.categoryId && { categoryId: query.categoryId }),
      ...(query.brandId && { brandId: query.brandId }),
      ...(query.skinType && {
        skinType: { contains: query.skinType, mode: 'insensitive' as const },
      }),
      ...((query.minPrice !== undefined || query.maxPrice !== undefined) && {
        price: {
          ...(query.minPrice !== undefined && { gte: query.minPrice }),
          ...(query.maxPrice !== undefined && { lte: query.maxPrice }),
        },
      }),
    };
    const orderBy =
      query.sort === ProductSortDto.PRICE_ASC
        ? { price: 'asc' as const }
        : query.sort === ProductSortDto.PRICE_DESC
          ? { price: 'desc' as const }
          : query.sort === ProductSortDto.NEWEST
            ? { createdAt: 'desc' as const }
            : { name: 'asc' as const };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: productInclude,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findBestSellers(limit: number) {
    const bestSellers = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    const ids = bestSellers.map((b) => b.productId);
    if (ids.length === 0) return [];

    const products = await this.prisma.product.findMany({
      where: { id: { in: ids }, status: ProductStatus.ACTIVE },
      include: productInclude,
    });

    return ids.map((id) => products.find((p) => p.id === id)).filter(Boolean);
  }

  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.product.findUnique({
      where: { slug },
      include: productInclude,
    });
  }

  async create(dto: CreateProductDto & { slug: string }) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        shortDescription: dto.shortDescription,
        description: dto.description,
        price: dto.price,
        comparePrice: dto.comparePrice,
        stock: dto.stock ?? 0,
        skinType: dto.skinType,
        status: dto.status ?? 'DRAFT',
        categoryId: dto.categoryId,
        brandId: dto.brandId,
        images: {
          create:
            dto.images
              ?.filter((image) => image.url)
              .map((image, index) => ({
                url: image.url,
                alt: image.alt,
                isPrimary: image.isPrimary ?? index === 0,
                sortOrder: image.sortOrder ?? index,
              })) ?? [],
        },
        ingredients: {
          create:
            dto.ingredients
              ?.filter((ingredient) => ingredient.name)
              .map((ingredient) => ({
                name: ingredient.name,
                percentage: ingredient.percentage,
              })) ?? [],
        },
        howToUse: {
          create:
            dto.howToUse
              ?.filter((step) => step.content)
              .map((step, index) => ({
                stepNumber: step.stepNumber ?? index + 1,
                content: step.content,
              })) ?? [],
        },
        benefits: {
          create:
            dto.benefits
              ?.filter((benefit) => benefit.title)
              .map((benefit) => ({ title: benefit.title })) ?? [],
        },
        ...(dto.seo &&
          (dto.seo.metaTitle ||
            dto.seo.metaDescription ||
            dto.seo.metaKeyword) && {
            seo: {
              create: {
                metaTitle: dto.seo.metaTitle,
                metaDescription: dto.seo.metaDescription,
                metaKeyword: dto.seo.metaKeyword,
              },
            },
          }),
      },
      include: productInclude,
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.slug !== undefined && { slug: dto.slug }),
        ...(dto.shortDescription !== undefined && {
          shortDescription: dto.shortDescription,
        }),
        ...(dto.description !== undefined && {
          description: dto.description,
        }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.comparePrice !== undefined && {
          comparePrice: dto.comparePrice,
        }),
        ...(dto.stock !== undefined && { stock: dto.stock }),
        ...(dto.skinType !== undefined && { skinType: dto.skinType }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.categoryId !== undefined && {
          categoryId: dto.categoryId,
        }),
        ...(dto.brandId !== undefined && { brandId: dto.brandId }),
        ...(dto.images !== undefined && {
          images: {
            deleteMany: {},
            create: dto.images
              .filter((image) => image.url)
              .map((image, index) => ({
                url: image.url,
                alt: image.alt,
                isPrimary: image.isPrimary ?? index === 0,
                sortOrder: image.sortOrder ?? index,
              })),
          },
        }),
        ...(dto.ingredients !== undefined && {
          ingredients: {
            deleteMany: {},
            create: dto.ingredients
              .filter((ingredient) => ingredient.name)
              .map((ingredient) => ({
                name: ingredient.name,
                percentage: ingredient.percentage,
              })),
          },
        }),
        ...(dto.howToUse !== undefined && {
          howToUse: {
            deleteMany: {},
            create: dto.howToUse
              .filter((step) => step.content)
              .map((step, index) => ({
                stepNumber: step.stepNumber ?? index + 1,
                content: step.content,
              })),
          },
        }),
        ...(dto.benefits !== undefined && {
          benefits: {
            deleteMany: {},
            create: dto.benefits
              .filter((benefit) => benefit.title)
              .map((benefit) => ({ title: benefit.title })),
          },
        }),
        ...(dto.seo !== undefined &&
          (dto.seo.metaTitle || dto.seo.metaDescription || dto.seo.metaKeyword
            ? {
                seo: {
                  upsert: {
                    create: {
                      metaTitle: dto.seo.metaTitle,
                      metaDescription: dto.seo.metaDescription,
                      metaKeyword: dto.seo.metaKeyword,
                    },
                    update: {
                      metaTitle: dto.seo.metaTitle,
                      metaDescription: dto.seo.metaDescription,
                      metaKeyword: dto.seo.metaKeyword,
                    },
                  },
                },
              }
            : {})),
      },
      include: productInclude,
    });
  }

  async remove(id: string) {
    await this.prisma.product.delete({ where: { id } });
  }

  async addImage(
    productId: string,
    data: {
      url: string;
      alt?: string;
      isPrimary?: boolean;
      sortOrder?: number;
    },
  ) {
    if (data.isPrimary) {
      await this.prisma.productImage.updateMany({
        where: { productId, isPrimary: true },
        data: { isPrimary: false },
      });
    }
    return this.prisma.productImage.create({
      data: {
        productId,
        url: data.url,
        alt: data.alt,
        isPrimary: data.isPrimary ?? false,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }
}
