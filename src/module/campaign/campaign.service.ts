import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CampaignRepository } from './campaign.repository';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { CreateCampaignDto, PlaceCampaignOrderDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

@Injectable()
export class CampaignService {
  constructor(
    private readonly repo: CampaignRepository,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async findAll(adminView = false) {
    if (adminView) return this.repo.findAll();
    return this.repo.findActive();
  }

  async findOne(slug: string) {
    const campaign =
      (await this.repo.findBySlug(slug)) ??
      (await this.repo.findById(slug));
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }

  async create(dto: CreateCampaignDto) {
    const slug = dto.slug ?? dto.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const existing = await this.repo.findBySlug(slug);
    if (existing) throw new ConflictException('Campaign slug already exists');
    return this.repo.create({ ...dto, slug });
  }

  async update(id: string, dto: UpdateCampaignDto) {
    const campaign = await this.repo.findById(id);
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (dto.slug) {
      const existing = await this.repo.findBySlug(dto.slug);
      if (existing && existing.id !== id) throw new ConflictException('Slug already in use');
    }
    return this.repo.update(id, dto);
  }

  async remove(id: string) {
    const campaign = await this.repo.findById(id);
    if (!campaign) throw new NotFoundException('Campaign not found');
    await this.repo.remove(id);
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');
    const url = await this.cloudinary.uploadImage(file, 'admin/campaigns');
    return { url };
  }

  async addImage(id: string, body: { url: string; alt?: string; sortOrder?: number }) {
    const campaign = await this.repo.findById(id);
    if (!campaign) throw new NotFoundException('Campaign not found');
    return this.repo.addImage(id, body);
  }

  async placeOrder(slug: string, dto: PlaceCampaignOrderDto) {
    const campaign = await this.repo.findBySlug(slug);
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.status !== 'ACTIVE') throw new BadRequestException('This campaign is no longer active');

    const unitPrice = campaign.campaignPrice
      ? Number(campaign.campaignPrice)
      : Number(campaign.product.price);

    const shippingCharge = dto.deliveryZone === 'INSIDE_DHAKA' ? 60 : 120;

    return this.repo.placeOrderWithProductId(
      campaign.id,
      campaign.productId,
      dto,
      unitPrice,
      shippingCharge,
    );
  }

  async getOrders(campaignId: string, page?: string, limit?: string) {
    const campaign = await this.repo.findById(campaignId);
    if (!campaign) throw new NotFoundException('Campaign not found');
    return this.repo.findOrders(campaignId, page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20);
  }

  async getAllOrders(page?: string, limit?: string) {
    return this.repo.findAllOrders(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20);
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.repo.updateOrderStatus(orderId, status);
  }
}
