import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { CampaignRepository } from './campaign.repository';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [CampaignController],
  providers: [CampaignService, CampaignRepository],
})
export class CampaignModule {}
