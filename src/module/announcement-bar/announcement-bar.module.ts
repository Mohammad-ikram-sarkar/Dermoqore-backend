import { Module } from '@nestjs/common';
import { AnnouncementBarController } from './announcement-bar.controller';
import { AnnouncementBarService } from './announcement-bar.service';
import { AnnouncementBarRepository } from './announcement-bar.repository';

@Module({
  controllers: [AnnouncementBarController],
  providers: [AnnouncementBarService, AnnouncementBarRepository],
})
export class AnnouncementBarModule {}
