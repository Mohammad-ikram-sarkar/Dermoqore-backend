import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DeliveryRepository } from './delivery.repository';
import { CreateDeliveryChargeDto } from './dto/create-delivery-charge.dto';
import { UpdateDeliveryChargeDto } from './dto/update-delivery-charge.dto';

@Injectable()
export class DeliveryService {
  constructor(private readonly deliveryRepository: DeliveryRepository) {}

  async findAll() {
    return this.deliveryRepository.findAll();
  }

  async findOne(id: string) {
    const charge = await this.deliveryRepository.findById(id);
    if (!charge) {
      throw new NotFoundException('Delivery charge not found');
    }
    return charge;
  }

  async create(dto: CreateDeliveryChargeDto) {
    const existing = await this.deliveryRepository.findByZone(dto.zone);
    if (existing) {
      throw new ConflictException(
        `Delivery charge for zone ${dto.zone} already exists`,
      );
    }
    return this.deliveryRepository.create(dto);
  }

  async update(id: string, dto: UpdateDeliveryChargeDto) {
    const charge = await this.deliveryRepository.findById(id);
    if (!charge) {
      throw new NotFoundException('Delivery charge not found');
    }
    if (dto.zone && dto.zone !== charge.zone) {
      const existing = await this.deliveryRepository.findByZone(dto.zone);
      if (existing) {
        throw new ConflictException(
          `Delivery charge for zone ${dto.zone} already exists`,
        );
      }
    }
    return this.deliveryRepository.update(id, dto);
  }

  async remove(id: string) {
    const charge = await this.deliveryRepository.findById(id);
    if (!charge) {
      throw new NotFoundException('Delivery charge not found');
    }
    await this.deliveryRepository.remove(id);
  }
}
