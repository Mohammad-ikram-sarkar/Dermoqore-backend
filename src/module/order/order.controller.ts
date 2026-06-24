import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { PlaceOrderDto } from './dto/place-order.dto';
import { PlaceGuestOrderDto } from './dto/place-guest-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // ── Address ────────────────────────────────────────────

  @Get('address')
  @UseGuards(JwtAuthGuard)
  getAddresses(@GetUser('id') userId: string) {
    return this.orderService.getAddresses(userId);
  }

  @Post('address')
  @UseGuards(JwtAuthGuard)
  createAddress(@GetUser('id') userId: string, @Body() dto: CreateAddressDto) {
    return this.orderService.createAddress(userId, dto);
  }

  @Put('address/:id')
  @UseGuards(JwtAuthGuard)
  updateAddress(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.orderService.updateAddress(id, userId, dto);
  }

  @Delete('address/:id')
  @UseGuards(JwtAuthGuard)
  deleteAddress(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.orderService.deleteAddress(id, userId);
  }

  @Put('address/:id/default')
  @UseGuards(JwtAuthGuard)
  setDefaultAddress(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.orderService.setDefaultAddress(id, userId);
  }

  // ── Customer Orders ────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard)
  myOrders(
    @GetUser('id') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.orderService.getMyOrders(
      userId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 12,
    );
  }

  // ── Admin ──────────────────────────────────────────────

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('zone') zone?: string,
    @Query('status') status?: string,
    @Query('phone') phone?: string,
  ) {
    return this.orderService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      zone,
      status,
      phone,
    );
  }

  @Get('admin/inside-dhaka')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  insideDhaka(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.orderService.findByZone(
      'INSIDE_DHAKA',
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('admin/outside-dhaka')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  outsideDhaka(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.orderService.findByZone(
      'OUTSIDE_DHAKA',
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Put('admin/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  myOrder(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.orderService.getMyOrder(id, userId);
  }

  @Post('guest')
  placeGuestOrder(@Body() dto: PlaceGuestOrderDto) {
    return this.orderService.placeGuestOrder(dto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  placeOrder(@GetUser('id') userId: string, @Body() dto: PlaceOrderDto) {
    return this.orderService.placeOrder(userId, dto);
  }

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancelOrder(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.orderService.cancelMyOrder(id, userId);
  }
}
