import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryChargeDto } from './dto/create-delivery-charge.dto';
import { UpdateDeliveryChargeDto } from './dto/update-delivery-charge.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  findAll() {
    return this.deliveryService.findAll();
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateDeliveryChargeDto) {
    return this.deliveryService.create(dto);
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateDeliveryChargeDto) {
    return this.deliveryService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.deliveryService.remove(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryService.findOne(id);
  }
}
