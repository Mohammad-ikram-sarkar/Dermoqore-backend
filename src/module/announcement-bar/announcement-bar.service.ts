import { Injectable, NotFoundException } from '@nestjs/common';
import { AnnouncementBarRepository } from './announcement-bar.repository';
import { CreateAnnouncementBarDto } from './dto/create-announcement-bar.dto';
import { UpdateAnnouncementBarDto } from './dto/update-announcement-bar.dto';

@Injectable()
export class AnnouncementBarService {
  constructor(
    private readonly announcementBarRepository: AnnouncementBarRepository,
  ) {}

  async findAll() {
    return this.announcementBarRepository.findAll();
  }

  async findActive() {
    return this.announcementBarRepository.findActive();
  }

  async findOne(id: string) {
    const bar = await this.announcementBarRepository.findById(id);
    if (!bar) {
      throw new NotFoundException('Announcement bar not found');
    }
    return bar;
  }

  async create(dto: CreateAnnouncementBarDto) {
    return this.announcementBarRepository.create(dto);
  }

  async update(id: string, dto: UpdateAnnouncementBarDto) {
    await this.findOne(id);
    return this.announcementBarRepository.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.announcementBarRepository.remove(id);
  }
}
