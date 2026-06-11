import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CompanyInfoRepository } from './companyinfo.repository';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { CreateCompanyInfoDto } from './dto/create-companyinfo.dto';
import { UpdateCompanyInfoDto } from './dto/update-companyinfo.dto';

@Injectable()
export class CompanyInfoService {
  constructor(
    private readonly companyInfoRepository: CompanyInfoRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll() {
    return this.companyInfoRepository.findAll();
  }

  async findOne(id: string) {
    const info = await this.companyInfoRepository.findById(id);
    if (!info) {
      throw new NotFoundException('Company info not found');
    }
    return info;
  }

  async create(dto: CreateCompanyInfoDto) {
    return this.companyInfoRepository.create(dto);
  }

  async update(id: string, dto: UpdateCompanyInfoDto) {
    const info = await this.companyInfoRepository.findById(id);
    if (!info) {
      throw new NotFoundException('Company info not found');
    }
    return this.companyInfoRepository.update(id, dto);
  }

  async remove(id: string) {
    const info = await this.companyInfoRepository.findById(id);
    if (!info) {
      throw new NotFoundException('Company info not found');
    }
    await this.companyInfoRepository.remove(id);
  }

  async uploadLogo(id: string, file: Express.Multer.File) {
    const info = await this.companyInfoRepository.findById(id);
    if (!info) {
      throw new NotFoundException('Company info not found');
    }

    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const logoUrl = await this.cloudinaryService.uploadImage(file);
    return this.companyInfoRepository.updateLogo(id, logoUrl);
  }
}
