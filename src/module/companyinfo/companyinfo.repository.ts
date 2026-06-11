import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCompanyInfoDto } from './dto/create-companyinfo.dto';
import { UpdateCompanyInfoDto } from './dto/update-companyinfo.dto';

@Injectable()
export class CompanyInfoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.companyInfo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.companyInfo.findUnique({ where: { id } });
  }

  async create(dto: CreateCompanyInfoDto) {
    return this.prisma.companyInfo.create({ data: dto });
  }

  async update(id: string, dto: UpdateCompanyInfoDto) {
    return this.prisma.companyInfo.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.prisma.companyInfo.delete({ where: { id } });
  }

  async updateLogo(id: string, logoUrl: string) {
    return this.prisma.companyInfo.update({
      where: { id },
      data: { logoUrl },
    });
  }
}
