import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateDeliveryChargeDto } from './dto/create-delivery-charge.dto';
import { UpdateDeliveryChargeDto } from './dto/update-delivery-charge.dto';

@Injectable()
export class DeliveryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.deliveryCharge.findMany({
      orderBy: { zone: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.deliveryCharge.findUnique({
      where: { id },
    });
  }

  async findByZone(zone: string) {
    return this.prisma.deliveryCharge.findUnique({
      where: { zone: zone as any },
    });
  }

  async create(dto: CreateDeliveryChargeDto) {
    return this.prisma.deliveryCharge.create({
      data: {
        zone: dto.zone as any,
        charge: dto.charge,
        minOrder: dto.minOrder,
      },
    });
  }

  async update(id: string, dto: UpdateDeliveryChargeDto) {
    return this.prisma.deliveryCharge.update({
      where: { id },
      data: {
        ...(dto.zone !== undefined && { zone: dto.zone as any }),
        ...(dto.charge !== undefined && { charge: dto.charge }),
        ...(dto.minOrder !== undefined && { minOrder: dto.minOrder }),
      },
    });
  }

  async remove(id: string) {
    await this.prisma.deliveryCharge.delete({ where: { id } });
  }
}
