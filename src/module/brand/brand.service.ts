import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { BrandRepository } from './brand.repository';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  async findAll() {
    return this.brandRepository.findAll();
  }

  async findOne(id: string) {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }

  async create(dto: CreateBrandDto) {
    const slug = dto.slug ?? dto.name.toLowerCase().replace(/\s+/g, '-');
    const existing = await this.brandRepository.findBySlug(slug);
    if (existing) {
      throw new ConflictException('Brand slug already exists');
    }
    return this.brandRepository.create({ ...dto, slug });
  }

  async update(id: string, dto: UpdateBrandDto) {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    if (dto.slug) {
      const existing = await this.brandRepository.findBySlug(dto.slug);
      if (existing && existing.id !== id) {
        throw new ConflictException('Brand slug already exists');
      }
    }
    return this.brandRepository.update(id, dto);
  }

  async remove(id: string) {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    await this.brandRepository.remove(id);
  }
}
