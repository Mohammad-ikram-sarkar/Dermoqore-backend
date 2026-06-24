import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { PrismaService } from '../../database/prisma.service';
import { PlaceOrderDto } from './dto/place-order.dto';
import { PlaceGuestOrderDto } from './dto/place-guest-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly prisma: PrismaService,
  ) {}

  // ── Address ────────────────────────────────────────────

  async getAddresses(userId: string) {
    return this.orderRepository.findAddressesByUser(userId);
  }

  async createAddress(userId: string, dto: CreateAddressDto) {
    if (dto.isDefault) {
      await this.orderRepository.unsetDefaultAddresses(userId);
    }
    return this.orderRepository.createAddress(userId, dto);
  }

  async updateAddress(id: string, userId: string, dto: UpdateAddressDto) {
    const address = await this.orderRepository.findAddressById(id);
    if (!address || address.userId !== userId) {
      throw new NotFoundException('Address not found');
    }
    if (dto.isDefault) {
      await this.orderRepository.unsetDefaultAddresses(userId);
    }
    return this.orderRepository.updateAddress(id, userId, dto);
  }

  async deleteAddress(id: string, userId: string) {
    const address = await this.orderRepository.findAddressById(id);
    if (!address || address.userId !== userId) {
      throw new NotFoundException('Address not found');
    }
    await this.orderRepository.deleteAddress(id);
  }

  async setDefaultAddress(id: string, userId: string) {
    const address = await this.orderRepository.findAddressById(id);
    if (!address || address.userId !== userId) {
      throw new NotFoundException('Address not found');
    }
    await this.orderRepository.unsetDefaultAddresses(userId);
    return this.orderRepository.updateAddress(id, userId, {
      isDefault: true,
    });
  }

  // ── Order Placement ────────────────────────────────────

  async placeOrder(userId: string, dto: PlaceOrderDto) {
    const address = await this.prisma.address.findFirst({
      where: { id: dto.shippingAddressId, userId },
    });
    if (!address) {
      throw new BadRequestException('Shipping address not found');
    }

    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { images: { where: { isPrimary: true }, take: 1 } },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of dto.items) {
      const product = productMap.get(item.productId)!;
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        );
      }
    }

    let subtotal = 0;
    const orderItems: {
      productId: string;
      name: string;
      image: string | undefined;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[] = [];

    for (const item of dto.items) {
      const product = productMap.get(item.productId)!;
      const unitPrice = Number(product.price);
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;
      orderItems.push({
        productId: item.productId,
        name: product.name,
        image: product.images[0]?.url,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });
    }

    const deliveryCharge = await this.prisma.deliveryCharge.findUnique({
      where: { zone: dto.deliveryZone as any },
    });

    if (!deliveryCharge) {
      throw new BadRequestException(
        `No delivery charge configured for ${dto.deliveryZone}`,
      );
    }

    const shippingCharge = Number(deliveryCharge.charge);
    if (
      deliveryCharge.minOrder &&
      subtotal >= Number(deliveryCharge.minOrder)
    ) {
      // free shipping above min order
    }

    const total = subtotal + shippingCharge;
    const orderNumber = this.generateOrderNumber();

    const order = await this.prisma.client_.$transaction(async (tx) => {
      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return tx.order.create({
        data: {
          orderNumber,
          userId,
          subtotal,
          shippingCharge,
          discount: 0,
          total,
          notes: dto.notes,
          deliveryZone: dto.deliveryZone as any,
          shippingAddressId: dto.shippingAddressId,
          items: {
            create: orderItems,
          },
        },
        include: { items: true, shippingAddress: true },
      });
    });

    return order;
  }

  async placeGuestOrder(dto: PlaceGuestOrderDto) {
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { images: { where: { isPrimary: true }, take: 1 } },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of dto.items) {
      const product = productMap.get(item.productId)!;
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${product.name}". Available: ${product.stock}`,
        );
      }
    }

    let subtotal = 0;
    const orderItems: {
      productId: string;
      name: string;
      image: string | undefined;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[] = [];

    for (const item of dto.items) {
      const product = productMap.get(item.productId)!;
      const unitPrice = Number(product.price);
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;
      orderItems.push({
        productId: item.productId,
        name: product.name,
        image: product.images[0]?.url,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });
    }

    const shippingCharge = dto.deliveryZone === 'INSIDE_DHAKA' ? 60 : 120;
    const total = subtotal + shippingCharge;
    const orderNumber = this.generateOrderNumber();

    return this.prisma.client_.$transaction(async (tx) => {
      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return tx.order.create({
        data: {
          orderNumber,
          subtotal,
          shippingCharge,
          discount: 0,
          total,
          notes: dto.notes,
          deliveryZone: dto.deliveryZone as any,
          recipientName: dto.customerName,
          recipientPhone: dto.customerPhone,
          recipientAddress: dto.customerAddress,
          items: { create: orderItems },
        },
        include: { items: true },
      });
    });
  }

  // ── Order Queries ──────────────────────────────────────

  async getMyOrders(userId: string, page = 1, limit = 12) {
    return this.orderRepository.findOrdersByUser(userId, page, limit);
  }

  async getMyOrder(id: string, userId: string) {
    const order = await this.orderRepository.findUserOrder(id, userId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async cancelMyOrder(id: string, userId: string) {
    const order = await this.orderRepository.findUserOrder(id, userId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status !== 'PENDING') {
      throw new BadRequestException('Only pending orders can be cancelled');
    }
    return this.orderRepository.updateOrderStatus(id, 'CANCELLED', {
      cancelledAt: new Date(),
    });
  }

  // ── Admin ──────────────────────────────────────────────

  async findAll(page = 1, limit = 20, zone?: string, status?: string, phone?: string) {
    return this.orderRepository.findAllOrders(page, limit, zone, status, phone);
  }

  async findByZone(zone: string, page = 1, limit = 20) {
    return this.orderRepository.findAllOrders(page, limit, zone);
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOrderById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.orderRepository.findOrderById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const extra: Record<string, Date> = {};
    if (dto.status === 'DELIVERED') {
      extra.deliveredAt = new Date();
    } else if (dto.status === 'CANCELLED') {
      extra.cancelledAt = new Date();
    }

    return this.orderRepository.updateOrderStatus(id, dto.status, extra);
  }

  // ── Helpers ────────────────────────────────────────────

  private generateOrderNumber(): string {
    const date = new Date();
    const yymmdd = date.toISOString().slice(2, 10).replace(/-/g, '');
    const rand = randomBytes(3).toString('hex').toUpperCase();
    return `DRM-${yymmdd}-${rand}`;
  }
}
