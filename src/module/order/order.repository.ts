import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PlaceOrderDto } from './dto/place-order.dto';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ── Address ────────────────────────────────────────────

  async findAddressesByUser(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findAddressById(id: string) {
    return this.prisma.address.findUnique({ where: { id } });
  }

  async createAddress(userId: string, dto: CreateAddressDto) {
    return this.prisma.address.create({
      data: {
        userId,
        label: dto.label ?? 'Home',
        name: dto.name,
        phone: dto.phone,
        address: dto.address,
        area: dto.area,
        city: dto.city ?? 'Dhaka',
        zone: dto.zone as any,
        isDefault: dto.isDefault ?? false,
      },
    });
  }

  async updateAddress(id: string, userId: string, dto: UpdateAddressDto) {
    return this.prisma.address.update({
      where: { id },
      data: {
        ...(dto.label !== undefined && { label: dto.label }),
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.area !== undefined && { area: dto.area }),
        ...(dto.city !== undefined && { city: dto.city }),
        ...(dto.zone !== undefined && { zone: dto.zone as any }),
        ...(dto.isDefault !== undefined && { isDefault: dto.isDefault }),
      },
    });
  }

  async deleteAddress(id: string) {
    await this.prisma.address.delete({ where: { id } });
  }

  async unsetDefaultAddresses(userId: string) {
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  // ── Order ──────────────────────────────────────────────

  async findOrdersByUser(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where: { userId } }),
    ]);
    return { items, total, page, limit };
  }

  async findOrderById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: true, shippingAddress: true },
    });
  }

  async findUserOrder(id: string, userId: string) {
    return this.prisma.order.findFirst({
      where: { id, userId },
      include: { items: true, shippingAddress: true },
    });
  }

  async findAllOrders(page: number, limit: number, zone?: string, status?: string, phone?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (zone) where.deliveryZone = zone;
    if (status) where.status = status;
    if (phone) where.OR = [
      { recipientPhone: { contains: phone } },
      { shippingAddress: { phone: { contains: phone } } },
    ];
    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: true,
          user: { select: { id: true, name: true, email: true } },
          shippingAddress: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  async createOrder(data: {
    orderNumber: string;
    userId: string;
    subtotal: number;
    shippingCharge: number;
    total: number;
    notes?: string;
    deliveryZone: string;
    shippingAddressId: string;
    items: {
      productId: string;
      name: string;
      image?: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[];
  }) {
    return this.prisma.order.create({
      data: {
        orderNumber: data.orderNumber,
        userId: data.userId,
        subtotal: data.subtotal,
        shippingCharge: data.shippingCharge,
        discount: 0,
        total: data.total,
        notes: data.notes,
        deliveryZone: data.deliveryZone as any,
        shippingAddressId: data.shippingAddressId,
        items: {
          create: data.items,
        },
      },
      include: { items: true, shippingAddress: true },
    });
  }

  async updateOrderStatus(
    id: string,
    status: string,
    extra?: Record<string, Date>,
  ) {
    return this.prisma.order.update({
      where: { id },
      data: {
        status: status as any,
        ...extra,
      },
      include: { items: true },
    });
  }
}
