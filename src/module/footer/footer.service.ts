import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FooterRepository } from './footer.repository';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { CreateFooterDto } from './dto/create-footer.dto';
import { UpdateFooterDto } from './dto/update-footer.dto';

@Injectable()
export class FooterService {
  constructor(
    private readonly footerRepository: FooterRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll() {
    return this.footerRepository.findAll();
  }

  async findOne(id: string) {
    const footer = await this.footerRepository.findById(id);
    if (!footer) {
      throw new NotFoundException('Footer not found');
    }
    return footer;
  }

  async create(dto: CreateFooterDto) {
    return this.footerRepository.create(dto);
  }

  async update(id: string, dto: UpdateFooterDto) {
    const footer = await this.footerRepository.findById(id);
    if (!footer) {
      throw new NotFoundException('Footer not found');
    }
    return this.footerRepository.update(id, dto);
  }

  async remove(id: string) {
    const footer = await this.footerRepository.findById(id);
    if (!footer) {
      throw new NotFoundException('Footer not found');
    }
    await this.footerRepository.remove(id);
  }

  async uploadLogo(id: string, file: Express.Multer.File) {
    const footer = await this.footerRepository.findById(id);
    if (!footer) {
      throw new NotFoundException('Footer not found');
    }
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const logo = await this.cloudinaryService.uploadImage(file);
    return this.footerRepository.updateLogo(id, logo);
  }
}
