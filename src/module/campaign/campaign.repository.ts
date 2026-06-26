import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCampaignDto, PlaceCampaignOrderDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

const campaignInclude = {
  product: {
    include: {
      images: { orderBy: { sortOrder: 'asc' as const } },
      category: true,
      brand: true,
    },
  },
  heroImages: { orderBy: { sortOrder: 'asc' as const } },
  faqs: { orderBy: { sortOrder: 'asc' as const } },
};

@Injectable()
export class CampaignRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.campaign.findMany({
      include: campaignInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActive() {
    return this.prisma.campaign.findMany({
      where: { status: 'ACTIVE' },
      include: campaignInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.campaign.findUnique({
      where: { id },
      include: campaignInclude,
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.campaign.findUnique({
      where: { slug },
      include: campaignInclude,
    });
  }

  async create(dto: CreateCampaignDto & { slug: string }) {
    return this.prisma.campaign.create({
      data: {
        slug: dto.slug,
        title: dto.title,
        subtitle: dto.subtitle,
        productId: dto.productId,
        videoUrl: dto.videoUrl,
        videoTitle: dto.videoTitle,
        productVideoUrl: dto.productVideoUrl,
        productVideoTitle: dto.productVideoTitle,
        campaignPrice: dto.campaignPrice,
        comparePrice: dto.comparePrice,
        whySections: (dto.whySections as object) ?? undefined,
        benefits: (dto.benefits as object) ?? undefined,
        testimonials: (dto.testimonials as object) ?? undefined,
        customerReviews: (dto.customerReviews as object) ?? undefined,
        included: (dto.included as object) ?? undefined,
        features: (dto.features as object) ?? undefined,
        ingredients: (dto.ingredients as object) ?? undefined,
        theme: dto.theme ?? 'DEFAULT',
        labReportTitle: dto.labReportTitle,
        labReportDescription: dto.labReportDescription,
        labReportButtonText: dto.labReportButtonText,
        labReportButtonUrl: dto.labReportButtonUrl,
        labReportImages: (dto.labReportImages as object) ?? undefined,
        offerBadge: dto.offerBadge,
        ctaText: dto.ctaText,
        phoneNumber: dto.phoneNumber,
        formTitle: dto.formTitle,
        status: dto.status ?? 'DRAFT',
        ...(dto.images?.length && {
          heroImages: {
            create: dto.images.map((img, i) => ({
              url: img.url,
              alt: img.alt,
              sortOrder: img.sortOrder ?? i,
            })),
          },
        }),
        ...(dto.faqs?.length && {
          faqs: {
            create: dto.faqs.map((faq, i) => ({
              question: faq.question,
              answer: faq.answer,
              sortOrder: faq.sortOrder ?? i,
            })),
          },
        }),
      },
      include: campaignInclude,
    });
  }

  async update(id: string, dto: UpdateCampaignDto) {
    return this.prisma.campaign.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.slug !== undefined && { slug: dto.slug }),
        ...(dto.subtitle !== undefined && { subtitle: dto.subtitle }),
        ...(dto.productId !== undefined && { productId: dto.productId }),
        ...(dto.videoUrl !== undefined && { videoUrl: dto.videoUrl }),
        ...(dto.videoTitle !== undefined && { videoTitle: dto.videoTitle }),
        ...(dto.productVideoUrl !== undefined && { productVideoUrl: dto.productVideoUrl }),
        ...(dto.productVideoTitle !== undefined && { productVideoTitle: dto.productVideoTitle }),
        ...(dto.campaignPrice !== undefined && { campaignPrice: dto.campaignPrice }),
        ...(dto.comparePrice !== undefined && { comparePrice: dto.comparePrice }),
        ...(dto.whySections !== undefined && { whySections: dto.whySections as object }),
        ...(dto.benefits !== undefined && { benefits: dto.benefits as object }),
        ...(dto.testimonials !== undefined && { testimonials: dto.testimonials as object }),
        ...(dto.customerReviews !== undefined && { customerReviews: dto.customerReviews as object }),
        ...(dto.included !== undefined && { included: dto.included as object }),
        ...(dto.features !== undefined && { features: dto.features as object }),
        ...(dto.ingredients !== undefined && { ingredients: dto.ingredients as object }),
        ...(dto.theme !== undefined && { theme: dto.theme }),
        ...(dto.labReportTitle !== undefined && { labReportTitle: dto.labReportTitle }),
        ...(dto.labReportDescription !== undefined && { labReportDescription: dto.labReportDescription }),
        ...(dto.labReportButtonText !== undefined && { labReportButtonText: dto.labReportButtonText }),
        ...(dto.labReportButtonUrl !== undefined && { labReportButtonUrl: dto.labReportButtonUrl }),
        ...(dto.labReportImages !== undefined && { labReportImages: dto.labReportImages as object }),
        ...(dto.offerBadge !== undefined && { offerBadge: dto.offerBadge }),
        ...(dto.ctaText !== undefined && { ctaText: dto.ctaText }),
        ...(dto.phoneNumber !== undefined && { phoneNumber: dto.phoneNumber }),
        ...(dto.formTitle !== undefined && { formTitle: dto.formTitle }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.images !== undefined && {
          heroImages: {
            deleteMany: {},
            create: dto.images.map((img, i) => ({
              url: img.url,
              alt: img.alt,
              sortOrder: img.sortOrder ?? i,
            })),
          },
        }),
        ...(dto.faqs !== undefined && {
          faqs: {
            deleteMany: {},
            create: dto.faqs.map((faq, i) => ({
              question: faq.question,
              answer: faq.answer,
              sortOrder: faq.sortOrder ?? i,
            })),
          },
        }),
      },
      include: campaignInclude,
    });
  }

  async remove(id: string) {
    await this.prisma.campaign.delete({ where: { id } });
  }

  async addImage(campaignId: string, data: { url: string; alt?: string; sortOrder?: number }) {
    return this.prisma.campaignImage.create({
      data: {
        campaignId,
        url: data.url,
        alt: data.alt,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async placeOrderWithProductId(
    campaignId: string,
    productId: string,
    dto: PlaceCampaignOrderDto,
    unitPrice: number,
    shippingCharge: number,
  ) {
    const orderNumber = `CAM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const total = unitPrice * dto.quantity + shippingCharge;
    return this.prisma.campaignOrder.create({
      data: {
        orderNumber,
        campaignId,
        productId,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        customerAddress: dto.customerAddress,
        deliveryZone: dto.deliveryZone,
        quantity: dto.quantity,
        unitPrice,
        shippingCharge,
        total,
        notes: dto.notes,
      },
      include: { campaign: { select: { title: true, slug: true } } },
    });
  }

  async findOrders(campaignId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.campaignOrder.findMany({
        where: { campaignId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.campaignOrder.count({ where: { campaignId } }),
    ]);
    return {
      items,
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  }

  async findAllOrders(page = 1, limit = 20, status?: string, phone?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;
    if (phone) where.customerPhone = { contains: phone };
    const [items, total] = await Promise.all([
      this.prisma.campaignOrder.findMany({
        where,
        include: { campaign: { select: { title: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.campaignOrder.count({ where }),
    ]);
    return {
      items,
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  }

  async findOrderById(orderId: string) {
    return this.prisma.campaignOrder.findUnique({
      where: { id: orderId },
      include: { campaign: { select: { title: true, slug: true } } },
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.prisma.campaignOrder.update({
      where: { id: orderId },
      data: { status: status as any },
      include: { campaign: { select: { title: true, slug: true } } },
    });
  }
}
