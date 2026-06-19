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
import { AnnouncementBarService } from './announcement-bar.service';
import { CreateAnnouncementBarDto } from './dto/create-announcement-bar.dto';
import { UpdateAnnouncementBarDto } from './dto/update-announcement-bar.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('announcement-bar')
export class AnnouncementBarController {
  constructor(
    private readonly announcementBarService: AnnouncementBarService,
  ) {}

  @Get()
  findAll() {
    return this.announcementBarService.findAll();
  }

  @Get('active')
  findActive() {
    return this.announcementBarService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.announcementBarService.findOne(id);
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body() dto: CreateAnnouncementBarDto) {
    return this.announcementBarService.create(dto);
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateAnnouncementBarDto) {
    return this.announcementBarService.update(id, dto);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.announcementBarService.remove(id);
  }
}
