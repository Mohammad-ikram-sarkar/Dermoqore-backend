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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto, PlaceCampaignOrderDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto, UpdateCampaignOrderStatusDto } from './dto/update-campaign.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  // ── Public ─────────────────────────────────────────────────────────────────

  @Get()
  findAll() {
    return this.campaignService.findAll(false);
  }

  // ── Admin ───────────────────────────────────────────────────────────────────
  // NOTE: All admin routes are registered before :slug to avoid param conflicts

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAllAdmin() {
    return this.campaignService.findAll(true);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateCampaignDto) {
    return this.campaignService.create(dto);
  }

  @Post('admin/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.campaignService.uploadImage(file);
  }

  @Get('admin/orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getAllOrders(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.campaignService.getAllOrders(page, limit);
  }

  @Get('admin/:id/orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getOrders(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.campaignService.getOrders(id, page, limit);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findOneAdmin(@Param('id') id: string) {
    return this.campaignService.findOne(id);
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    return this.campaignService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.campaignService.remove(id);
  }

  @Post('admin/:id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  addImage(
    @Param('id') id: string,
    @Body() body: { url: string; alt?: string; sortOrder?: number },
  ) {
    return this.campaignService.addImage(id, body);
  }

  @Put('admin/orders/:orderId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body() dto: UpdateCampaignOrderStatusDto,
  ) {
    return this.campaignService.updateOrderStatus(orderId, dto.status);
  }

  // ── Public — order placement (must be before :slug) ────────────────────────

  @Post(':slug/order')
  placeOrder(@Param('slug') slug: string, @Body() dto: PlaceCampaignOrderDto) {
    return this.campaignService.placeOrder(slug, dto);
  }

  // ── Public — campaign detail (must be last) ─────────────────────────────────

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.campaignService.findOne(slug);
  }
}
