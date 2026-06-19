import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BannerRepository } from './banner.repository';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannerService {
  constructor(
    private readonly bannerRepository: BannerRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll() {
    return this.bannerRepository.findAll();
  }

  async findOne(id: string) {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    return banner;
  }

  async findByClient(clientId: string) {
    return this.bannerRepository.findByClientId(clientId);
  }

  async create(dto: CreateBannerDto) {
    return this.bannerRepository.create(dto);
  }

  async update(id: string, dto: UpdateBannerDto) {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    return this.bannerRepository.update(id, dto);
  }

  async remove(id: string) {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    await this.bannerRepository.remove(id);
  }

  async uploadImage(id: string, file: Express.Multer.File) {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new NotFoundException('Banner not found');
    }
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const imageUrl = await this.cloudinaryService.uploadImage(
      file,
      'admin/banner',
    );
    return this.bannerRepository.updateImage(id, imageUrl);
  }
}
